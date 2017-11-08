'use strict'

const Promise = require('bluebird');

const RedisEvents = require('ocbesbn-redis-events');
const BlobClient = require('ocbesbn-blob-client');
const ServiceClient = require('ocbesbn-service-client');

const Api = require('../api/inChannelConfig.js');
const InChannelContract = require('../api/inChannelContract.js');
const Voucher = require('../api/voucher.js');

const fs = require('fs');
const writeFile = Promise.promisify(fs.writeFile);

const handlebars = require('handlebars');
const readFileAsync = Promise.promisify(fs.readFile);


/* Conventions:
InChannelConfig.status = new | approved | activated   // inPreparation
InChannelContract.status = new | approved
*/


/**
 * Initializes all routes for RESTful access.
 *
 * @param {object} app - [Express]{@link https://github.com/expressjs/express} instance.
 * @param {object} db - If passed by the web server initialization, a [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - Everything from [config.routes]{@link https://github.com/OpusCapitaBusinessNetwork/web-init} passed when running the web server initialization.
 * @returns {Promise} [Promise]{@link http://bluebirdjs.com/docs/api-reference.html}
 * @see [Minimum setup]{@link https://github.com/OpusCapitaBusinessNetwork/web-init#minimum-setup}
 */
module.exports.init = function(app, db, config)
{
    return Promise.all([
        Api.init(db),
        InChannelContract.init(db),
        Voucher.init(db)
    ])
    .then(() => {
        this.events = new RedisEvents({ consul : { host : 'consul' } });
        this.serviceClient = new ServiceClient({ consul : { host : 'consul' } });


        //  Test event subscriptions:
        const evt1 = this.events.subscribe('inChannelConfig.created', (data) => {
            console.log("Event received for \"inChannelConfig.created\"", data);
        });
        const evt2 = this.events.subscribe('inChannelConfig.updated', (data) => {
            console.log("Event received for \"inChannelConfig.updated\"", data);
        });
        const evt3 = this.events.subscribe('inChannelContract.created', (data) => {
            console.log("Event received for \"inChannelContract.created\"", data);
        });
        const evt4 = this.events.subscribe('inChannelContract.updated', (data) => {
            console.log("Event received for \"inChannelContract.updated\"", data);
        });
        const evt5 = this.events.subscribe('voucher.created', (data) => {
            console.log("Event received for \"voucher.created\"", data);
        });


        const evt6 = this.events.subscribe('sales-inoivce.created', (data) => {
            this.transferSalesInvoice(data);
        });

        return Promise.all([ evt1, evt2, evt3, evt4, evt5, evt6 ]).then(() =>
        {
            this.blob = new BlobClient({});   // ??? Why does this.blobclient not work?

            app.use(checkContentType);

            // InChannelConfig
            //
            app.get('/api/config/inchannels/:supplierId', (req, res) => this.sendInChannelConfig(req, res));
            app.put('/api/config/inchannels/:supplierId', (req, res) => this.updateInChannelConfig(req, res));
            app.post('/api/config/inchannels', (req, res) => this.addInChannelConfig(req, res));
            app.put('/api/config/inchannels/:supplierId/finish', (req, res) => this.approveInChannelConfig(req, res));

            // InChannelContract
            //
            app.get('/api/config/inchannelcontracts/:tenantId', (req, res) => this.sendInChannelContracts(req, res));
            app.get('/api/config/inchannelcontracts/:tenantId1/:tenantId2', (req, res) => this.sendInChannelContract(req, res));
            app.put('/api/config/inchannelcontracts/:tenantId1/:tenantId2', (req, res) => this.updateInChannelContract(req, res));
            app.post('/api/config/inchannelcontracts/:tenantId', (req, res) => this.addInChannelContract(req, res));


            // Voucher
            //
            // TODO: search only for Vouchers with state != 'closed'
            app.get('/api/config/vouchers/:supplierId', (req, res) => this.sendOneVoucher(req, res));
            app.post('/api/config/vouchers', (req, res) => this.addVoucher(req, res));
            // TODO: voucher vs. vouchers - for first step of adjustments, we keep "voucher". As soon as onboarding is adjusted: remove
            app.post('/api/config/voucher', (req, res) => this.addVoucher(req, res));

            // forwarding of REST calls
            app.get('/api/customers/:customerId', (req, res) => this.sendCustomer(req, res));

            app.get('/api/emailrcv/:tenantId/:messageId', (req, res) => this.getPdf(req, res));
        });
    });
}


/**
 * Steps to transfer a Sales-Invoice:
 * 1. set Status to sending
 * 2. trigger transfer of a2a-integration
 * 3. set STatus to sent/sendingfailed
 */
 module.exports.transferSalesInvoice = function(invoice) {

    console.log("transferSalesInvoice started with: ", invoice);

    let supplierId = invoice.supplierId;
    let invoiceNumber = invoice.invoiceNumber;

    Api.getInChannelConfig(supplierId)
    .then((icc) => {
        if (icc.inputType === 'keyIn') {
            return this.serviceClient.put("sales-invoice",
                `/api/salesinvoices/${supplierId}/${invoiceNumber}`,
                {status: "sending"},
                true)
            .spread((salesInvoice, response) => {
                return this.serviceClient.post("a2a-integration",
                    "/api/sales-invoices",
                    invoice,
                    true)
            })
            .then((result) => {
                return this.serviceClient.put("sales-invoice",
                    `/api/salesinvoices/${supplierId}/${invoiceNumber}`,
                    {status: "sent"},
                    true)
            })
            .catch((e) => {
                console.log("Error, transfer to a2a-integration does not work for invoice " + invoice.id + "(" + supplierId + "-" + invoiceNumber + "): ", e);
            });
        }
        else {
            console.log("Error: Transfer of Sales-Invoice " + invoiceNumber + " stopped, because 'keyIn'-InChannel configuration is not defined found for supplier " + supplierId + ". Setting status of Sales-Invoice to 'sendingNotGranted'.");
            this.serviceClient.put("sales-invoice",
                `/api/salesinvoices/${supplierId}/${invoiceNumber}`,
                {status: "sendingNotGranted"},
                true);
        }
    })
    .catch((e) => {
        console.log("Error: Transfer of Sales-Invoice " + invoiceNumber + " stopped: ", e);
        this.serviceClient.put("sales-invoice",
            `/api/salesinvoices/${supplierId}/${invoiceNumber}`,
            {status: "sendingNotGranted"},
            true);
    })
}




function checkContentType(req, res, next)
{
    var method = req.method.toLowerCase();
    var contentType = req.headers['content-type'] && req.headers['content-type'].toLowerCase();

    if(method !== 'get' && !(contentType == 'application/json' || contentType == 'application/'))
        res.status(400).json({ message : 'Invalid content type. Has to be "application/json".' });
    else
        next();
}


//////////////////////////////////////////////////////////////
// InChannelConfig
//////////////////////////////////////////////////////////////

module.exports.sendInChannelConfig = function(req, res)
{
    var supplierId = req.params.supplierId;

    Api.inChannelConfigExists(supplierId).then(exists =>
    {
        if(exists)
        {
            return Api.getInChannelConfig(supplierId).then(config =>
            {
                (config && res.json(config)) || res.status('404').json({ message : 'No configuration found for this supplier.' });
            });
        }
        else
        {
            res.status('404').json({ message : 'This supplier has no in-channel configuration.' });
        }
    })
    .catch(e => {
        console.log("sendInChannelConfig - Error: ", e);
        res.status('400').json({ message : e.message })
    });
}

module.exports.addInChannelConfig = function(req, res)
{
    console.log('Api got the call');
    var supplierId = req.body.supplierId;
    Api.inChannelConfigExists(supplierId).then(exists =>
    {
        if (exists)
        {
            console.log('supplierId exists');
            res.status('409').json({ message : 'This supplier already owns an in-channel configuration.' });
        }
        else
        {
            var obj = req.body || { }
            console.log('supplierId not existiong, creating new');

            obj.supplierId = supplierId;
            obj.createdBy = req.opuscapita.userData('id');

            return Api.addInChannelConfig(obj, true)
                .then(config => this.events.emit(config, 'inChannelConfig.created').then(() => config))
                .then(config => res.status(202).json(config));
        }
    })
    .catch(e => {
        console.log("addInChannelConfig - Error: ", e);
        res.status('400').json({ message : e.message });
    });
}

module.exports.updateInChannelConfig = function(req, res)
{
    var supplierId = req.params.supplierId;

    Api.inChannelConfigExists(supplierId).then(exists =>
    {
        if(exists)
        {
            var obj = req.body || { }
            obj.supplierId = supplierId;
            obj.changedBy = req.opuscapita.userData('id');

            return Api.updateInChannelConfig(supplierId, obj, true)
                .then(config => this.events.emit(config, 'inChannelConfig.updated').then(() => config))
                .then(config => res.status(202).json(config));
        }
        else
        {
            res.status('404').json({ message : 'This supplier has no in-channel to be updated.' });
        }
    })
    .catch(e => {
        console.log("updateInChannelConfig - Error: ", e);
        res.status('400').json({ message : e.message });
    });
}


/**
 * The Supplier finally approved his configurations. This results in
 * 1. Set approved state in InChannelConfig
 * 2. push the uploaded example pdf to xxx
 * What else???
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
module.exports.approveInChannelConfig = function(req, res) {

    let supplierId = req.params.supplierId;

    return new Promise((resolve, reject) => {
        Api.inChannelConfigExists(supplierId)
        .then(exists => {
            if(exists) {
                var obj = req.body || { }
                obj.supplierId = supplierId;
                obj.changedBy = req.opuscapita.userData('id');
                if (!obj.hasOwnProperty("status")) {
                    obj.status = 'activated';
                }
                return Api.updateInChannelConfig(supplierId, obj, true)
                .then(config => {
                    return this.events.emit(config, 'inChannelConfig.updated');
                })
// ???
//                .then(() => {
//                    voucher.setState("closed");
//                })
                // .then(() => {
                // TODO: How to initiated external processes on e.g. gdp (Global Ditigizing Platform)? To be defined!
                //    return Promise.resolve();
                //})
                .catch((e) => {
                    console.log("approveInChannelConfig - Error: ", e);
                    res.status('400').json({ message : e.message })
                })
            }
            else {
                reject();
            }
        })
        .then(() => resolve());
    })
    .then(() => {
        res.status(200).send();
    })
    .catch(e => {
        console.log("approveInChannelConfig - Error: ", e);
        res.status('400').json({ message : e.message })
    });
}

//////////////////////////////////////////////////////////////
// InChannelContract
//////////////////////////////////////////////////////////////

function determineBusinessPartners(tenantId1, tenantId2) {

    let allowedPrefixes = [ 'c_', 's_' ];
    let prefix1 = tenantId1.substring(0,2);
    let prefix2 = tenantId2.substring(0,2);

    let supplierId;
    let customerId;

    if (!prefix1 || !prefix2 || prefix1 == prefix2 || !allowedPrefixes.includes(prefix1) || !allowedPrefixes.includes(prefix2)) {
        throw new Error("Proper Tenant definition is required! Please provide 's_<supplierId>' and 'c_<customerId>' as part of the URL. (" + tenantId1 + ", " + tenantId2 + ")'");
    }

    if (tenantId1.startsWith("s_")) {
        supplierId = tenantId1.substring(2);
        customerId = tenantId2.substring(2);
    }
    else {
        customerId = tenantId1.substring(2);
        supplierId = tenantId2.substring(2);
    }

    return {supplierId: supplierId, customerId, customerId};
}


module.exports.sendInChannelContract = function(req, res)
{
    try {
        let bp = determineBusinessPartners(req.params.tenantId1, req.params.tenantId2);

        return InChannelContract.get(bp.customerId, bp.supplierId)
        .then(data => {
            (data && res.json(data)) || res.status('404').json({ message : 'No entry found for the supplier-customer pair ' + bp.supplierId + "+" + bp.customerId});
        })
    }
    catch(e) {
        console.log("sendInChannelContract - Error: ", e);
        res.status('400').json({message: e.message});
    }
}

module.exports.sendInChannelContracts = function(req, res)
{
    const tenantId = req.params.tenantId;

    let searchObj = {};
    if (tenantId.startsWith("s_")){
        searchObj.supplierId = tenantId.substring(2)
        if(req.query.customerIds) {
            searchObj.customerId = Array.isArray(req.query.customerIds) ? req.query.customerIds
                : req.query.customerIds.replace(/\s/g, '').toLowerCase().split(',');
        }
    }
    else if (tenantId.startsWith("c_")) {
        searchObj.customerId = tenantId.substring(2)
        if(req.query.supplierIds) {
            searchObj.supplierId = Array.isArray(req.query.supplierIds) ? req.query.supplierIds
                : req.query.supplierIds.replace(/\s/g, '').toLowerCase().split(',');
        }
    }

    if (tenantId && !(searchObj.customerId || searchObj.supplierId)) {
        res.status('400').json({ message : "TenantId " + tenantId + " is invalid! Please provide a valid tenant identifier that starts with either 's_' or 'c_'."});
    }
    else {
        InChannelContract.getAll(searchObj)
        .then(contacts => res.json(contacts))
        .catch((e) => {
            req.opuscapita.logger.error('Error when getting InChannelContracts: %s', e);
            res.status('400').json({ message : e.message });
        });
    }
}

module.exports.addInChannelContract = function(req, res)
{
    try {
        let tenantId = req.params.tenantId;
        let supplierId;
        let customerId;

        let obj = req.body || {};

        if (tenantId.startsWith("s_")){
            supplierId = tenantId.substring(2);
            obj.supplierId = supplierId;       // Overwrite provided data.
            customerId = obj.customerId;
        }
        else if (tenantId.startsWith("c_")) {
            customerId = tenantId.substring(2);
            obj.customerId = customerId;       // or shall we throw an error if values distinct?
            supplierId = obj.supplierId;
        }
        else {
            throw new Error("TenantId " + tenantId + " is invalid! Please provide a valid tenant identifier that starts with either 's_' or 'c_'.");
        }

        if (!(customerId || supplierId)) {
            throw new Error("Please provide a supplierId tenant or a customerId tenant in the URI.")
        }



        InChannelContract.exists(customerId, supplierId)
        .then(exists => {
            if (exists) {
                res.status('409').json({ message : 'This customer-supplier relation (' + customerId + '+' + supplierId + ') already owns an in-channel configuration.' });
            }
            else {
                obj.createdBy = req.opuscapita.userData('id');

                Voucher.get(customerId, supplierId)
                .then((voucher) => {
                    obj.customerSupplierId = voucher.customerSupplierId;
                    return InChannelContract.add(obj, true)
                })
                .then(icc => this.events.emit(icc, 'inChannelContract.created').then(() => icc))
                .then(icc => res.status(200).json(icc));
            }
        });
    }
    catch(e) {
        console.log("addInChannelContract - Error: ", e);
        res.status('400').json({ message : e.message });
    };
}

module.exports.updateInChannelContract = function(req, res)
{
    try {
        let bp = determineBusinessPartners(req.params.tenantId1, req.params.tenantId2);

        if (req.body.customerId && bp.customerId != req.body.customerId) {
            throw new Error ("Customer " + req.body.supplierId + " is not allowed to update an InChannelContract for customer " + bp.supplierId + ".");
        }
        if (req.body.supplierId && bp.supplierId != req.body.supplierId) {
            throw new Error ("Supplier " + req.body.supplierId + " is not allowed to update an InChannelContract for supplier " + bp.supplierId + ".");
        }

        InChannelContract.exists(bp.customerId, bp.supplierId)
        .then((exists) => {
            if(exists) {
                var obj = req.body || { }
                obj.changedBy = req.opuscapita.userData('id');

                Voucher.get(bp.customerId, bp.supplierId)
                .then((voucher) => {
                    obj.customerSupplierId = voucher.customerSupplierId;
                    return InChannelContract.update(bp.customerId, bp.supplierId, obj)
                })
                .then( () => {
                    return InChannelContract.get(bp.customerId, bp.supplierId);
                })
                .then((icc) => this.events.emit(icc, 'inChannelContract.updated').then(() => icc))
                .then((icc) => {
                    res.status(200).json(icc);
                });
            }
            else {
                res.status('404').json({ message : 'This customer-supplier relation (' + bp.customerId + '+' + bp.supplierId + ') does not own an in-channel contract to be updated.' });
            }
        });
    }
    catch(e) {
        console.log("updateInChannelContract - Error: ", e);
        res.status('400').json({ message : e.message });
    }
}



//////////////////////////////////////////////////////////////////////
// Voucher
//////////////////////////////////////////////////////////////////////

module.exports.sendOneVoucher = function(req, res)
{
    let supplierId = req.params.supplierId;

    return new Promise((resolve, reject) => {
        resolve(Voucher.getOneBySupplier(supplierId));
    })
    .then(data => {
        if (data) {
            (data && res.json(data)) || res.status('200').json(data);
        }
        else {
            (data && res.json(data)) || res.status('404').json({ message : 'No Voucher object found for supplier ' + supplierId});
        }
    })
    .catch((e) => {
        console.log("sendOneVoucher - Error: ", e);
        res.status('400').json({message: e.message});
    })
}


module.exports.addVoucher = function(req, res)
{
    let data = req.body;
    let customerId = data.customerId;
    let supplierId = data.supplierId;

    if (!supplierId) {
        res.status('400').json({message: 'A supplierId is needed to create a Voucher.'});
    }
    if (!customerId) {
        res.status('400').json({message: 'A customerId is needed to create a Voucher.'});
    }

    Voucher.exists(customerId, supplierId)
    .then((exists) => {
        if (exists) {
            res.status('409').json({ message : 'The voucher entry for customer ' + customerId + ' and supplier ' + supplierId + ' already exist!'});
        }
        else {
            data.status = data.status || "new";
            data.createdBy = req.opuscapita.userData('id');

            return Voucher.add(data)
            .then((voucher) => this.events.emit(voucher, 'voucher.created').then(() => voucher))
            .then((voucher) => {
                res.status(200).json(voucher);
            })
        }
    })
    .catch((e) => {
        console.log("addVoucher - Error: ", e);
        res.status('400').json({ message : e.message });
    });
}


//////////////////////////////////////////////////////
// REST forwards to access data from other services
//////////////////////////////////////////////////////

module.exports.sendCustomer = function(req, res)
{
    let customerId = req.params.customerId;

    req.opuscapita.serviceClient.get("customer", "/api/customers/" + customerId, true)
    .spread((customer, response) => {
        res.status(200).json(customer);
    })
    .catch((e) => {
        console.log("getCustomer - Error: ", e);
        res.status("400").json({message: e.message});
    })
}

module.exports.getPdf = async function(req, res) // '/api/emailrcv/:tenantId/:messageId'
{
    const tenantId = req.params.tenantId;
    if (!tenantId.startsWith('s_')) res.status("400").json({message: 'Invalid tenantId'});

    const supplierId = req.params.tenantId.substring(2);
    const messageId = req.params.messageId;

    const blobClient = new BlobClient({ serviceClient: req.opuscapita.serviceClient });
    const serviceClient = new ServiceClient({ consul : { host : 'consul' } });
    const path = `/private/email/received/${messageId}/`;

    try {
        const files = await blobClient.listFiles(tenantId, path)
        var pdfFile = files.filter(item => item.extension == '.pdf').sort((a,b) => a.name > b.name )[0];

        if (pdfFile && files.map(file => file.name).includes('email.json')) {
            var link = `/einvoice-send/key-in/${messageId}/${pdfFile.name}`;

            const jsonFileContents = JSON.parse(await blobClient.readFile(tenantId, path + 'email.json'));
            const destEmail = jsonFileContents.From;

            const pdfFileContents = await blobClient.readFile(tenantId, path + pdfFile.name);

            const subject = "Supplier's user notification";
            const templateSource = await readFileAsync(__dirname + '/../templates/supplier-notification-email.html', 'utf8');

            const compiledTemplate = handlebars.compile(templateSource);
            const context = { emails: destEmail, link }  // change
            const html = compiledTemplate(context);

            const base = { // needs to be replaced with the better configuration. HTML template a
                to : destEmail, // emailsString
                subject,
                html
            }
            const sentChangeAfter = await serviceClient.post('email', '/api/send', base, true);

            const queryString = 'supplierId=' + supplierId;
            const users = (await serviceClient.get('user', `/api/users?${queryString}`, true))[0];

            const sentNotifications = await Promise.all(users.map(user => {
                return serviceClient.post('notification', '/api/notifications/', {
                    'userId': user.id,
                    'message': link, // change
                    'status': 'new'
                }, true);
            }));

            res.status("200").json({message: 'Success'}); // change
        } else {
            res.status("400").json({message: 'Pdf or JSON file was not found'}); // change
        }
    } catch(e) {
        res.status("400").json({message: e.message});
    }
}

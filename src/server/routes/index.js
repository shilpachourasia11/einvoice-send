'use strict'

const Promise = require('bluebird');
const Multer = require('multer');

const RedisEvents = require('ocbesbn-redis-events');
const BlobClient = require('ocbesbn-blob-client');

const Api = require('../api.js');
const InChannelContract = require('../api/inChannelContract.js');

const fs = require('fs');
const writeFile = Promise.promisify(fs.writeFile);


/* Questions:
TODO: which statuses shall we support?
- created
- active
- mappingStarted
- approvedToC
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
        InChannelContract.init(db)
    ])
    .then(() => {
        this.events = new RedisEvents({ consul : { host : 'consul' } });
        // this.blobclient = new BlobClient({});  ??? why does it not work for variable blobclient ???
        this.blob       = new BlobClient({});

        // app.use(checkContentType);  ???

        var upload  = Multer({
          storage: Multer.memoryStorage(),
          fileFilter: (req, file, cb) => {
            // console.log("---> file: ", file);
            var filename = file.originalname;
            var extension = filename.substr(filename.lastIndexOf('.') + 1);
            if (extension.toLowerCase() == 'pdf') {
              cb(null, true)
            }
            else {
              cb(null, false)
            }
          }
        });


        // TODO: Refactoring of endpoints: Only one endpoint /api/config/inchannel
        // TODO: What about a default in dev mode???
        //
        app.get('/api/config/inchannel', (req, res) => this.sendInChannelConfig(req, res));
        app.get('/api/config/inchannel/current', (req, res) => this.sendInChannelConfig(req, res, true));
        app.get('/api/config/inchannel/:supplierId', (req, res) => this.sendInChannelConfig(req, res));

        app.put('/api/config/inchannel', (req, res) => this.updateInChannelConfig(req, res));
        app.put('/api/config/inchannel/current', (req, res) => this.updateInChannelConfig(req, res, true));
        app.put('/api/config/inchannel/:supplierId', (req, res) => this.updateInChannelConfig(req, res));

        app.post('/api/config/inchannel/current', (req, res) => this.addInChannelConfig(req, res, true));
        app.post('/api/config/inchannel', (req, res) => this.addInChannelConfig(req, res));

        app.get('/api/test', (req, res) => res.json(req.opuscapita.userData()));

        // blob access, like upload of PDF, download of TermsAndConditions, ...
        app.post('/api/config/inchannel/file', upload.single('file'), (req, res) => this.addPdfExample(req, res));
        app.get('/api/inchannel/octermsandconditions', (req, res) => this.sendOCTermsAndConditions(req, res));
        app.get('/api/inchannel/termsandconditions/:cusomterId', (req, res) => this.sendCustomerTermsAndConditions(req, res));

        // InChannelContract
        app.get('/api/config/inchannelcontract/:customerId/:supplierId', (req, res) => this.sendInChannelContract(req, res));
        app.get('/api/config/inchannelcontract/:relatedTenantId', (req, res) => this.sendInChannelContract(req, res));

        app.post('/api/config/inchannelcontract/:relatedTenantId', (req, res) => this.addInChannelContract(req, res));  // ???
        app.post('/api/config/inchannelcontract', (req, res) => this.addInChannelContract(req, res));

        app.put('/api/config/inchannelcontract/:relatedTenantId', (req, res) => this.updateInChannelContract(req, res));  // ???
        app.put('/api/config/inchannelcontract', (req, res) => this.updateInChannelContract(req, res));


        // Supplier finally approved the final step:
        app.get('/api/config/inchannel/approved', (req, res) => this.approveInChannelConfig(req, res));

    });
}

module.exports.sendInChannelConfig = function(req, res, useCurrentUser)
{
    // TODO: Refactoring of supplierId determination
    let supplierId = req.opuscapita.userData('supplierId');
    if (req.params.supplierId) {
        supplierId = req.params.supplierId;
    }
    if (!supplierId) {
        supplierId = 'ABC';    // ??? Remove - only for test!
    }

console.log(">> ", supplierId);

    Api.inChannelConfigExists(supplierId)
    .then(exists => {
        if(exists)
        {
            return Api.getInChannelConfig(supplierId)
            .then(config => {
                (config && res.json(config)) || res.status('404').json({ message : 'No configuration found for this supplier.' });
            });
        }
        else
        {
            res.status('404').json({ message : 'This supplier has no in-channel configuration.' });
        }
    })
    .catch(e => res.status('400').json({ message : e.message }));
}

module.exports.addInChannelConfig = function(req, res, useCurrentUser)
{
    let supplierId = req.opuscapita.userData('supplierId');
    if (req.params.supplierId) {
        supplierId = req.params.supplierId;
    }

    if (!supplierId) {
        supplierId = 'ABC';    // ??? Remove - only for test!
    }

    // var supplierId = useCurrentUser ? req.opuscapita.userData('supplierId') : req.body.supplierId;

console.log(">> addInChannelConfig - supplierId", supplierId);

    Api.inChannelConfigExists(supplierId)
    .then(exists => {
        if (exists)
        {
            res.status('409').json({ message : 'This supplier already owns an in-channel configuration.' });
        }
        else
        {
            var obj = req.body || { }

            obj.supplierId = supplierId;
            obj.createdBy = req.opuscapita.userData('id') || req.body.createdBy || "dummy";  // ??? test test test!!!

console.log(">> addInChannelConfig - obj", obj);

            return Api.addInChannelConfig(obj, true)
                .then(config => this.events.emit(config, 'inChannelConfig.added').then(() => config))
                .then(config => res.status(202).json(config));
        }
    })
    .catch(e => {
        // logger.error (...)  ???
        console.log("addInChannelConfig error: ", e);
        res.status('400').json({ message : e.message });
    });
}

module.exports.updateInChannelConfig = function(req, res, useCurrentUser)
{
    let supplierId = req.opuscapita.userData('supplierId');
    if (req.params.supplierId) {
        supplierId = req.params.supplierId;
    }
    if (!supplierId) {
        supplierId = 'ABC';    // ??? Remove - only for test!
    }

    // var supplierId = useCurrentUser ? req.opuscapita.userData('supplierId') : req.params.supplierId;

console.log(">> updateInChannelConfig", supplierId);

    Api.inChannelConfigExists(supplierId).then(exists =>
    {
        if(exists)
        {
            var obj = req.body || { }

            obj.supplierId = supplierId;
            obj.updatedBy = req.opuscapita.userData('id') || req.params.updatedBy;

            return Api.updateInChannelConfig(supplierId, obj, true)
                .then(config => this.events.emit(config, 'inChannelConfig.updated').then(() => config))
                .then(config => res.status(202).json(config));
        }
        else
        {
            res.status('404').json({ message : 'This supplier has no in-channel to be updated.' });
        }
    })
    .catch(e => res.status('400').json({ message : e.message }));
}





////////////////////////////////////////////////////////////////////




/**
 * Store PDF example file for invoice-mapping in blob
 *
 * @param  {object} [req]{@link http://expressjs.com/de/api.html#req}
 * @param  {object} [res]{@link http://expressjs.com/de/api.html#res}
 * @return {Promise} [Promise]{@link http://bluebirdjs.com/docs/api-reference.html}
 */
module.exports.addPdfExample = function(req, res)
{
    let supplierId = req.opuscapita.userData('supplierId');
    if (req.params.supplierId) {
        supplierId = req.params.supplierId;
    }
    if (!supplierId) {
        supplierId = 'ABC';    // ??? Remove - only for test!
    }

    /*
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(req.headers);
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(req.body) // form fields
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log(req.file); // form file
    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    req.on('data', (data) => {
      console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
      console.log(data.toString());
      console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^");
    });
    */

    const file = req.file;

    if (file && req.file.buffer) {
        const buffer = req.file.buffer;
        const filename = req.file.originalname;

        // writeFile("./" + filename, buffer)  // for test only

        this.blob.storeFile("s_" + supplierId, "einvoice/InvoiceTemplate", buffer)  // Storage will be created automatically, if needed.
        .then((result) => {                                                         // ??? ask Christian about the result of the blob file storage.  ???
            console.log("The file " + filename + " was received and stored on local file system.");
            res.status('200').json({ message : 'PDF file ' + filename + ' received.' });
        })
        .catch((err) => {
            console.log(err);
            res.status('400').json({ message : err.message });
        });
    }
    else {
      res.status('400').json({ message : 'No PDF file received.' });
    }
}

/**
 * As soon as the supplier finished his configuration, we have to forward the
 * PDF example file to the Mapping-team.
 * TODO: Explain the process.
 *
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {Promise} [Promise]{@link http://bluebirdjs.com/docs/api-reference.html}
 */
module.exports.forwardPdfExample = function(req, res) {

    // forwards the stored PDF (see blob) to the mapping team.

    let supplierId = req.opuscapita.userData('supplierId');
    if (req.params.supplierId) {
        supplierId = req.params.supplierId;
    }
    if (!supplierId) {
        supplierId = 'ABC';    // ??? Remove - only for test!
    }


    console.log(">>>>>> Pusching the uploaded PDF example to XXX");

    // TODO: What to do???

    this.blob.readFile("s_" + supplierId, "einvoice/InvoiceTemplate", buffer)
    .then((buffer) => {
        return writeFile("./uploadedInvoiceExample.pdf" , buffer);  // for test only   ???
    });
}

// later, probably
module.exports.sendOCTermsAndConditions = function(req, res) {

    console.log(">> sendOCTermsAndConditions");

    this.blob.readFile("", "/einvoice-send/TermsAndConditions")   // ??? Christian: tenantId -> CustomerId vs SupplierId
    .then((result) => res.status(200).send(text))                  // ??? Christian: What is the result? A Buffer, a String, a File, ...
    .catch((e) => res.status('400').json({message: e.message}));
}


module.exports.sendCustomerTermsAndConditions = function(req, res) {
    let customerId = req.params.customerId;

console.log(">> sendCustomerTermsAndConditions - customerId", customerId);

    this.blob.readFile("c_" + customerId, "/einvoice-send/TermsAndConditions")   // ??? Christian: tenantId -> CustomerId vs SupplierId
    .then((result) => res.status(200).send(text))                  // ??? Christian: What is the result? A Buffer, a String, a File, ...
    .catch((e) => res.status('400').json({message: e.message}));
}


////////////////////////////////////////////////////////////////////




/**
 * We have three different ways on how the business partners (Supplier and
 * Customer) could get defined:
 * 1. Explizit in the REST call URL.
 * 2. Explizit in the REST body.
 * 3. One businessparter implizit (see userData) plus the other one in the URL.
 *
 * Rule 3 overrules the others!
 * Rules 1 and 2 are not handled differently in this method. The caller already
 * defines his priority by passing the correct data as parameters of this method.
 *
 * @param  {[type]} req                  [description]
 * @param  {[type]} predefinedCustomerId [description]
 * @param  {[type]} predefinedSupplierId [description]
 * @return {[type]}                      [description]
 */
function determineBusinessPartner(req, predefinedCustomerId, predefinedSupplierId) {

console.log(" - relatedTenantId", req.params.relatedTenantId);
console.log(" - supplier", req.params.supplierId);
console.log(" - customerId", req.params.customerId)

    let supplierId = predefinedSupplierId;
    let customerId = predefinedCustomerId;

    // Implizit Supplier assignment has highest priority
    if (req.opuscapita.userData('supplierId')) {
        supplierId = req.opuscapita.userData('supplierId');
        if (req.params.relatedTenantId) {
            customerId = req.params.relatedTenantId;
        }
    }

    if (req.opuscapita.userData('customerId')) {
        customerId = req.opuscapita.userData('customerId');
        if (req.params.relatedTenantId) {
            supplierId = req.params.relatedTenantId;
        }
    }



    // only for testing ??? ???
    if (!supplierId) {
        supplierId = 'ABC';    // ??? Remove - only for test!
        customerId = req.params.relatedTenantId;
    }


    if (!supplierId && !customerId) {
        throw new Error ("A supplierId and customerId (assigment and/or parameter ) is required.")
    }
    if (!supplierId) {
        throw new Error ("A supplierId/assignment is required.")
    }
    if (!customerId) {
        throw new Error ("A customerId/assignment is required.")
    }

    return {supplierId: supplierId, customerId, customerId};
}


module.exports.sendInChannelContract = function(req, res, useCurrentUser)
{
    try {
        let bp = determineBusinessPartner(req, req.params.customerId, req.params.supplierId);

// console.log(">> sendInChannelContract - businesspartner: ", bp.supplierId, bp.customerId);

        return InChannelContract.get(bp.customerId, bp.supplierId)
        .then(data => {
            (data && res.json(data)) || res.status('404').json({ message : 'No object found for the supplier-customer pair ' + bp.supplierId + "+" + bp.customerId});
        })
    }
    catch(e) {
        res.status('400').json({message: e.message});
    }
}


module.exports.addInChannelContract = function(req, res)
{
    try {
        let bp = determineBusinessPartner(req, req.body.customerId, req.body.supplierId);

        if (req.body.customerId && bp.customerId != req.body.customerId) {
            throw new Error ("Customer " + req.body.supplierId + " is not allowed to add an InChannelContract for customer " + bp.supplierId + ".");
        }
        if (req.body.supplierId && bp.supplierId != req.body.supplierId) {
            throw new Error ("Supplier " + req.body.supplierId + " is not allowed to add an InChannelContract for supplier " + bp.supplierId + ".");
        }

console.log(">> addInChannelContract - businesspartner: ", bp.supplierId, bp.customerId);

        InChannelContract.exists(bp.customerId, bp.supplierId)
        .then(exists => {
            if (exists) {
                res.status('409').json({ message : 'This customer-supplier relation (' + bp.customerId + '+' + bp.supplierId + ') already owns an in-channel configuration.' });
            }
            else {
                var obj = req.body || { };
                obj.supplierId = bp.supplierId;
                obj.customerId = bp.customerId;
                obj.createdBy = req.opuscapita.userData('id') || req.body.createdBy;

                return InChannelContract.add(obj, true)
                .then(icc => this.events.emit(icc, 'inChannelContract.added').then(() => icc))
                .then(icc => res.status(200).json(icc));
            }
        });
    }
    catch(e) {
        // logger.error (...)  ???
        console.log("addInChannelContract error: ", e);

        res.status('400').json({ message : e.message });
    };
}

module.exports.updateInChannelContract = function(req, res)
{
    try {
        let bp = determineBusinessPartner(req, req.body.customerId, req.body.supplierId);

        if (req.body.customerId && bp.customerId != req.body.customerId) {
            throw new Error ("Customer " + req.body.supplierId + " is not allowed to update an InChannelContract for customer " + bp.supplierId + ".");
        }
        if (req.body.supplierId && bp.supplierId != req.body.supplierId) {
            throw new Error ("Supplier " + req.body.supplierId + " is not allowed to update an InChannelContract for supplier " + bp.supplierId + ".");
        }

console.log(">> updateInChannelContract - businesspartner: ", bp.customerId, bp.supplierId);

        InChannelContract.exists(bp.customerId, bp.supplierId)
        .then((exists) => {
            if(exists) {
                var obj = req.body || { }

                obj.supplierId = bp.supplierId;
                obj.updatedBy = req.opuscapita.userData('id') || req.params.updatedBy;
                obj.changedOn = new Date();  // ??? via db?

                return InChannelContract.update(bp.customerId, bp.supplierId, obj)
                .then( () => {
                    return InChannelContract.get(bp.customerId, bp.supplierId);
                })
                .then((icc) => {
                    return this.events.emit(icc, 'InChannelContract.updated')
                    .then(() => icc);
                })
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
        res.status('400').json({ message : e.message });
    }
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
    let supplierId = req.opuscapita.userData('supplierId');
    if (req.params.supplierId) {
        supplierId = req.params.supplierId;
    }
    if (!supplierId) {
        supplierId = 'ABC';    // ??? Remove - only for test!
    }

console.log(">> approveInChannelConfig", supplierId);

    return new Promise((resolve, reject) => {
        Api.inChannelConfigExists(supplierId)
        .then(exists => {
            if(exists) {
                var obj = {
                    supplierId : supplierId,
                    updatedBy : req.opuscapita.userData('id') || "dummy",       // ??? only for test
                    status :'started'
                };
                return Api.updateInChannelConfig(supplierId, obj, true)
                .then(config => {
                    return this.events.emit(config, 'inChannelConfig.updated');
                }).then(() => {
                    resolve();
                });
            }
            else {
                reject();
            }
        })
    })
    .then(() => {
        return forwardPDFExample();
    })
    .then(() => {
        res.status(200);
    })
    .catch(e => res.status('400').json({ message : e.message }));
}



function checkContentType(req, res, next)
{
    var method = req.method.toLowerCase();
    var contentType = req.headers['content-type'] && req.headers['content-type'].toLowerCase();

    if(method !== 'get' && !(contentType == 'application/json' || contentType == 'application/'))  // multipart ???
        res.status(400).json({ message : 'Invalid content type. Has to be "application/json".' });
    else
        next();
}

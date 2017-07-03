'use strict'

const Promise = require('bluebird');
const Multer = require('multer');

const RedisEvents = require('ocbesbn-redis-events');
const BlobClient = require('ocbesbn-blob-client');

const Api = require('../api/inChannelConfig.js');
const InChannelContract = require('../api/inChannelContract.js');
const Voucher = require('../api/voucher.js');

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
        InChannelContract.init(db),
        Voucher.init(db)
    ])
    .then(() => {
        this.events = new RedisEvents({ consul : { host : 'consul' } });
        // this.blobclient = new BlobClient({});  ??? why does it not work for variable blobclient ???
        this.blob       = new BlobClient({});

        // app.use(checkContentType);  ???

        var upload  = Multer({
          storage: Multer.memoryStorage(),
          fileFilter: (req, file, cb) => {
            cb(null, true);
/*
??? Reactivate!!!
            // console.log("---> file: ", file);
            var filename = file.originalname;
            var extension = filename.substr(filename.lastIndexOf('.') + 1);
            if (extension.toLowerCase() == 'pdf') {
              cb(null, true)
            }
            else {
              cb(null, false)
            }
*/
          }
        });


        // TODO: Move to own Routes: inchannel, inchannelcontract, voucher, ...
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
        //
        app.post('/api/config/inchannelfile', upload.single('file'), (req, res) => this.addPdfExample(req, res));
        app.get('/api/config/inchannelfile', (req, res) => this.getPdfExample(req, res));
        app.get('/api/config/inchannelfile2', (req, res) => {console.log("----------- file2"); this.getPdfExample(req, res); });

        app.post('/api/blob/addfile/:tenantId', upload.single('file'), (req, res) => this.addfile(req, res));
        app.get('/api/blob/storefile/:tenantId', (req, res) => this.storeFile(req, res));
        app.get('/api/blob/list/:tenantId', (req, res) => this.listFolder(req, res));

        app.get('/api/inchannel/octermsandconditions', (req, res) => this.sendOCTermsAndConditions(req, res));
        app.get('/api/inchannel/termsandconditions/:customerId', (req, res) => this.sendCustomerTermsAndConditions(req, res));


        // InChannelContract
        // TODO: Create own express Router
        //
        app.get('/api/config/inchannelcontract/:customerId/:supplierId', (req, res) => this.sendInChannelContract(req, res));
        app.get('/api/config/inchannelcontract/:relatedTenantId', (req, res) => this.sendInChannelContract(req, res));

        app.post('/api/config/inchannelcontract/:relatedTenantId', (req, res) => this.addInChannelContract(req, res));  // ???
        app.post('/api/config/inchannelcontract', (req, res) => this.addInChannelContract(req, res));

        app.put('/api/config/inchannelcontract/:relatedTenantId', (req, res) => this.updateInChannelContract(req, res));  // ???
        app.put('/api/config/inchannelcontract', (req, res) => this.updateInChannelContract(req, res));


        // Voucher
        //
        app.get('/api/config/voucher', (req, res) => this.sendOneVoucher(req, res));
        app.get('/api/config/voucher/:supplierId', (req, res) => this.sendOneVoucher(req, res));

        // app.put('/api/config/voucher', (req, res) => this.updateVoucher(req, res));
        // app.put('/api/config/voucher/:supplierId', (req, res) => this.updateVoucher(req, res));
        app.post('/api/config/voucher', (req, res) => this.addVoucher(req, res));


        // Supplier finally approved the final step:
        //
        app.put('/api/config/finish', (req, res) => this.approveInChannelConfig(req, res));

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
            obj.createdBy = req.opuscapita.userData('id') || req.body.createdBy || "byTest";  // ??? test test test!!!

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
            obj.changedBy = req.opuscapita.userData('id') || req.params.changedBy || "byTest"; // ??? Remove!

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
        console.log("Error: ", e);
        res.status('400').json({ message : e.message });
    });
}





////////////////////////////////////////////////////////////////////



function generateSupplierTenantId(suppierId) {
    return "s_" + suppierId;
}


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

    supplierId = supplierId.toLowerCase();

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

    let blob = new BlobClient({
        serviceClient : req.opuscapita.serviceClient
    });

    const file = req.file;

    if (file && req.file.buffer) {
        const buffer = req.file.buffer;
        const filename = req.file.originalname;

        // writeFile("./" + filename, buffer)  // for test only

        let tenantId = generateSupplierTenantId(supplierId);
        let targetfilename = "/private/einvoice-send/InvoiceTemplate.pdf";
console.log("******** Storing file " + filename + " at " + tenantId + " + " + targetfilename);


// TODO: ??? createFile(..., true) will do a createStorage directly.
        blob.createStorage(tenantId)
        .then((result) => {
            return blob.createFile(tenantId, targetfilename, buffer)
            .catch((err) => {
                // file already exist.
                if (err) {
                    return blob.storeFile(tenantId, targetfilename, buffer);
                }
            });
        })
        .then((result) => {
            console.log("The file " + filename + " was stored it in the blob storage.");
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


module.exports.getPdfExample = function(req, res)
{
    let supplierId = req.opuscapita.userData('supplierId');
    if (req.params.supplierId) {
        supplierId = req.params.supplierId;
    }
    if (!supplierId) {
        supplierId = 'ABC';    // ??? Remove - only for test!
    }

    let tenantId = generateSupplierTenantId(supplierId)
    let filename = "/private/einvoice-send/InvoiceTemplate.pdf"


    let blob = new BlobClient({
        serviceClient : req.opuscapita.serviceClient
    });

    blob.readFile(tenantId, filename)
    .spread((buffer, fileInfo) => {
        if (buffer) {
            writeFile("./uploadedInvoiceExample.pdf" , buffer);  // for test only   ???
            res.status('200').json({ message : 'PDF file ' + filename + ' found.' });
        }
        else {
            console.log("---- Error with the access of the stored blob: ", buffer);
            res.status('400').json({message : 'Error with the access of the stored blob at ' + filename});
        }
    })
    .catch((err) => {
        console.log(err);
        res.status('400').json({ message : err.message });
    });
}



//////////////////////////////////////////////////////////////////
// Test methods
//////////////////////////////////////////////////////////////////

module.exports.listFolder = function(req, res)
{
    let tenantId = req.params.tenantId;
    let filename = req.query.path  || "/public/einvoice-send";

    console.log("Called Listing for " + tenantId + ": " + filename);

    // this.blob.listEntries(tenantId, "/private/" + filename)
    this.blob.listEntries(tenantId, filename)
    .then((entries) => {
        res.status('200').json({ files : entries});
    })
    .catch((err) => {
        console.log(err);
        res.status('400').json({ message : err.message });
    });
}

module.exports.addfile = function(req, res)
{
    const file = req.file;
    let filename = file.originalname;
    let blobtarget = "/private/" + filename;

    let blobpath = req.query.targetpath;
    if (blobpath) {
        blobtarget = blobpath
    }

    let tenantId = req.params.tenantId;

    console.log("Called AddFile for " + tenantId + " in " + filename + " to " + blobtarget);

    if (file && req.file.buffer) {
        const buffer = req.file.buffer;
        this.blob.createStorage(tenantId)
        .then((result) => {
            return this.blob.createFile(tenantId, blobtarget, buffer)
            .catch((err) => {
                if (err) {
                    return this.blob.storeFile(tenantId, blobtarget, buffer)
                }
            });
        })
        .then((result) => {
            console.log("Received the file " + filename + " stored it in the blob storage.");
            res.status('200').json({ message : 'File ' + filename + ' received and stored at ' + blobtarget });
        })
        .catch((err) => {
            console.log(err);
            res.status('400').json({ message : err.message });
        });
    }
    else {
      res.status('400').json({ message : 'No file received.' });
    }
}

module.exports.storeFile = function(req, res) {

    let tenantId = req.params.tenantId;
    let filename = req.query.path;
    let targetfilename = req.query.targetpath;

    console.log("Calls StoreFile for " + tenantId + " of " + filename + " to " + targetfilename);

    this.blob.readFile(tenantId, filename)
    .spread((buffer, fileinfo) => {
        if (buffer) {
            writeFile(targetfilename , buffer);
            res.status('200').json({ message : 'file ' + filename + ' was stored at ' + targetfilename});
        }
        else {
            console.log("---- Error with the access of the stored blob: ", buffer);
            res.status('400').json({message : 'Error with the access of the stored blob at ' + filename});
        }
    })
    .catch((err) => {
        console.log(err);
        res.status('400').json({ message : err.message });
    });
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
module.exports.forwardPdfExample = function(req, res, supplierId) {

console.log(">>>>>> Pushing the PDF example that was uploaded for supplier " + supplierId + " to ???");

    // TODO: What to do???

    let tenantId = generateSupplierTenantId(supplierId);
    let filename = "/private/einvoice-send/InvoiceTemplate.pdf";

    return this.blob.readFile(tenantId, filename)
    .spread((buffer, fileInfo) => {
        if (buffer) {
            // TODO: Up to now it is not defined what to do with the file. tbd!
            // writeFile("./uploadedInvoiceExample.pdf" , buffer)
            res.status('200').json({ message : 'PDF file ' + filename + ' found.' });
        }
        else {
            console.log("---- Error with the access of the stored blob: ", buffer);
            res.status('400').json({message : 'Error with the access of the stored blob at ' + filename});
        }
    })
    .catch((err) => {
        console.log(err);
        res.status('400').json({ message : err.message });
    });
}

// later. Probably.
module.exports.sendOCTermsAndConditions = function(req, res) {

    console.log(">> sendOCTermsAndConditions");

    this.blob.readFile("OpusCapita", "/public/einvoice-send/TermsAndConditions")
    .spread((result, fileInfo) => res.status(200).send(text))
    .catch((e) => res.status('400').json({message: e.message}));
}


/**
 * Delivers the Customer specific terms and conditions as text
 * @param  {[type]} req [description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
module.exports.sendCustomerTermsAndConditions = function(req, res) {

    let customerId = req.params.customerId;
    let tenantId = "c-" + customerId;
    let filename = "/public/einvoice-send/TermsAndConditions.txt";

console.log(">> sendCustomerTermsAndConditions - customerId: " + customerId + " -> tenantId: ", tenantId);

    this.blob.storageExists(tenantId)
    .then((doesExist) => {
        if (doesExist) {
            this.blob.readFile(tenantId, filename)
            .spread((buffer, fileInfo) => {
                if (buffer) {
                    let text = buffer.toString();
                    res.status('200').send(text)
                }
                else {
                    res.status('400').json({message : 'No data found for customer ' + customerId + ' at ' + filename});
                }
            })
        }
        else {
            // return Promise.reject(new Error('No data found for customer ' + customerId));
            res.status('400').json({ message : 'No data found for customer ' + customerId });
        }
    })
    .catch((err) => {
        console.log(err);
        res.status('400').json({ message : err.message });
    });
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

console.log(" - predefinedCustomerId", predefinedCustomerId);
console.log(" - predefinedSupplierId", predefinedSupplierId);
console.log(" - req.params.relatedTenantId", req.params.relatedTenantId);
console.log(" - req.params.supplier", req.params.supplierId);
console.log(" - req.params.customerId", req.params.customerId)

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

    return {supplierId: supplierId, customerId, customerId};
}

function check4BusinessPartner(req, predefinedCustomerId, predefinedSupplierId) {

    let bp = determineBusinessPartner(req, predefinedCustomerId, predefinedSupplierId);

    // only for testing ??? ???
    if (!bp.supplierId) {
        bp.supplierId = 'ABC';    // ??? Remove - only for test!
        bp.customerId = bp.customerId || predefinedCustomerId || req.params.relatedTenantId;
    }


    if (!bp.supplierId && !bp.customerId) {
        throw new Error ("A supplierId and customerId (assigment and/or parameter ) is required.")
    }
    if (!bp.supplierId) {
        throw new Error ("A supplierId/assignment is required.")
    }
    if (!bp.customerId) {
        throw new Error ("A customerId/assignment is required.")
    }
    return bp;
}



module.exports.sendInChannelContract = function(req, res, useCurrentUser)
{
    try {
        let bp = check4BusinessPartner(req, req.params.customerId, req.params.supplierId);

console.log(">> sendInChannelContract - businesspartner: ", bp.supplierId, bp.customerId);

        return InChannelContract.get(bp.customerId, bp.supplierId)
        .then(data => {
            (data && res.json(data)) || res.status('404').json({ message : 'No entry found for the supplier-customer pair ' + bp.supplierId + "+" + bp.customerId});
        })
    }
    catch(e) {
        res.status('400').json({message: e.message});
    }
}


module.exports.addInChannelContract = function(req, res)
{
console.log(">> addInChannelContract - started! req.body: ", req.body);

    try {
        let bp = check4BusinessPartner(req, req.body.customerId, req.body.supplierId);

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
                obj.createdBy = req.opuscapita.userData('id') || req.body.createdBy || "byTest"; // ??? only for test

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
console.log(">> updateInChannelContract - started! req.body: ", req.body);
    try {
        let bp = check4BusinessPartner(req, req.body.customerId, req.body.supplierId);

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
                obj.changedBy = req.opuscapita.userData('id') || req.params.changedBy;
                obj.changedOn = new Date();  // ??? via db?

                return InChannelContract.update(bp.customerId, bp.supplierId, obj)
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
// console.log(">> approveInChannelConfig - exists: ", exists);
            if(exists) {
                var obj = {
                    supplierId : supplierId,
                    changedBy : req.opuscapita.userData('id') || "byTest",       // ??? only for test
                    status : 'activated'   // 'preparation'
                };
                return Api.updateInChannelConfig(supplierId, obj, true)
                .then(config => {
// console.log(">> approveInChannelConfig - update done: ", config);
                    return this.events.emit(config, 'inChannelConfig.updated');
                })
                // .then(() => {
                // console.log(">> approveInChannelConfig - emit done.");
                    // return this.forwardPdfExample(req, res, supplierId); - for inputType = pdf
                //    return Promise.resolve();
                //})
                .catch((error) => {
                    console.log("An error occured: ", error);
                    res.status('400').json({ message : error.message })
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
        // logger.error
        console.log("An error occured: ", e);
        res.status('400').json({ message : e.message })
    });
}


//////////////////////////////////////////////////////////////////////
// Voucher
//////////////////////////////////////////////////////////////////////

module.exports.sendVoucher = function(req, res)
{
    try {
        let bp = determineBusinessPartner(req, req.params.customerId, req.params.supplierId);

console.log(">> sendVoucher - businesspartner: ", bp.supplierId, bp.customerId);


        return Voucher.get(bp.customerId, bp.supplierId)
        .then(data => {
            (data && res.json(data)) || res.status('404').json({ message : 'No Voucher object found for the supplier-customer pair ' + bp.supplierId + "+" + bp.customerId});
        })
    }
    catch(e) {
        res.status('400').json({message: e.message});
    }
}

module.exports.sendOneVoucher = function(req, res)
{
    try {
        let bp = determineBusinessPartner(req, null, req.params.supplierId);

console.log(">> sendOneVoucher - businesspartner: ", bp.customerId, bp.supplierId);

        return new Promise((resolve, reject) => {
            if (bp.customerId && bp.supplierId) {
                resolve(Voucher.getOne(bp.customerId, bp.supplierId));
            }
            if (bp.supplierId) {
                resolve(Voucher.getOneBySupplier(bp.supplierId));
            }
            else {  // only for test ???
                resolve(Voucher.getAny());
            }
        })
        .then(data => {
            if (data) {
                console.log(">> sendOneVoucher - data: ", data.dataValues);
                (data && res.json(data)) || res.status('200').json(data);
            }
            else {
                (data && res.json(data)) || res.status('404').json({ message : 'No Voucher object found for the supplier-customer pair ' + bp.supplierId + "+" + bp.customerId});
            }
        })
        .catch((error) => {
            console.log("sendOneVoucher: ", error);
            res.status('400').json({message: error.message});
        })
    }
    catch(error) {
        res.status('400').json({message: error.message});
    }
}


module.exports.addVoucher = function(req, res)
{
console.log(">> addVoucher - req.body: ", req.body);
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
            data.createdBy = req.opuscapita.userData('id') || data.createdBy || "byTest"; // ??? only for test

            return Voucher.add(data)
            .then((voucher) => this.events.emit(voucher, 'voucher.added').then(() => voucher))
            .then((voucher) => {
                res.status(200).json(voucher);
            })
        }
    })
    .catch((error) => {
        // logger.error (...)  ???
        console.log("addVoucher error: ", error);
        res.status('400').json({ message : error.message });
    });
}


/*
module.exports.updateVoucher = function(req, res)
{
... ??? ToDo
}
*/





function checkContentType(req, res, next)
{
    var method = req.method.toLowerCase();
    var contentType = req.headers['content-type'] && req.headers['content-type'].toLowerCase();

    if(method !== 'get' && !(contentType == 'application/json' || contentType == 'application/'))  // multipart ???
        res.status(400).json({ message : 'Invalid content type. Has to be "application/json".' });
    else
        next();
}

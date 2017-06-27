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

        app.post('/api/filetest', upload.single('file'), (req, res) => this.addPdfExampleTest(req, res));
        app.get('/api/filetest', (req, res) => this.getPdfExampleTest(req, res));
        app.get('/api/listtest', (req, res) => this.listFolderTest(req, res));


        app.get('/api/inchannel/octermsandconditions', (req, res) => this.sendOCTermsAndConditions(req, res));
        app.get('/api/inchannel/termsandconditions/:cusomterId', (req, res) => this.sendCustomerTermsAndConditions(req, res));

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



function generateSupplierTenantId(suppierId) {
    return "s-" + suppierId.toLowerCase();
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

    const file = req.file;

    if (file && req.file.buffer) {
        const buffer = req.file.buffer;
        const filename = req.file.originalname;

        // writeFile("./" + filename, buffer)  // for test only

        let tenantId = generateSupplierTenantId(supplierId);
        let targetfilename = "einvoice/InvoiceTemplate.pdf";
console.log("******** Storing file " + filename + " at " + tenantId + " + " + targetfilename);

        this.blob.createStorage(tenantId)   // ??? comment by Chris    ????
        .then((result) => {
            return this.blob.createFile(tenantId, targetfilename, buffer)
            .catch((err) => {
                // file already exist.
                if (err) {
                    return this.blob.storeFile(tenantId, targetfilename, buffer);
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
console.log(">>>>>>> getPdfExample is started");
    let supplierId = req.opuscapita.userData('supplierId');
    if (req.params.supplierId) {
        supplierId = req.params.supplierId;
    }
    if (!supplierId) {
        supplierId = 'ABC';    // ??? Remove - only for test!
    }


    let tenantId = generateSupplierTenantId(supplierId)
    let filename = "einvoice/InvoiceTemplate.pdf"
console.log(">>>>>>>>>>1 getPdfExampmle " + tenantId, filename);

    this.blob.readFile(tenantId, filename)
    .then((buffer) => {
        if (buffer) {
// console.log("Buffer: ", buffer);
            return writeFile("./uploadedInvoiceExample.pdf" , buffer);  // for test only   ???
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



module.exports.addPdfExampleTest = function(req, res)
{
    const file = req.file;
    let tenantId = generateSupplierTenantId("ABC");
    let filename = "einvoice/InvoiceTemplate.pdf";

    if (file && req.file.buffer) {
        const buffer = req.file.buffer;
        // const filename = req.file.originalname;

        // writeFile("./" + filename, buffer)  // for test only

console.log(">>>>>>>>>>1 " + tenantId, filename);

        this.blob.createStorage(tenantId)   // ??? comment by Chris    ????
        .then((result) => {
            return this.blob.createFile(tenantId, filename, buffer)
            .catch((err) => {
console.log(">>>>>>>>>>1.1 result: ", err);
                if (err) {
                    return this.blob.storeFile(tenantId, filename, buffer)
                }
            });
        })
        .then((result) => {
console.log(">>>>>>>>>>1.2 result: ", result);
            console.log("Received the file " + filename + " stored it in the blob storage.");
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

/*
main_1         | Buffer:  { name: 'InvoiceTemplate.pdf',
main_1         |   extension: '.pdf',
main_1         |   location: '/private/einvoice',
main_1         |   path: '/private/einvoice/InvoiceTemplate.pdf',
main_1         |   size: 183,
main_1         |   isFile: true,
main_1         |   isDirectory: false,
main_1         |   lastModified: '2017-06-23T14:09:09.000Z',
main_1         |   contentType: 'application/json',
main_1         |   content: { content: { type: 'Buffer', data: [Object] } } }

 */
module.exports.getPdfExampleTest = function(req, res)
{
console.log(">>>>>>> getPdfExampleTest is started");

    let tenantId = generateSupplierTenantId("ABC");
    let filename = "einvoice/InvoiceTemplate.pdf";
    let targetfilename = "./uploadedInvoiceExample.pdf";

    this.blob.readFile(tenantId, filename)
    .then((result) => {
        if (result) {
// console.log("Received Buffer has a size of: ", result.content.length);

console.log("Buffer: ", result);

console.log("Writing buffer in file" + filename);
            writeFile(targetfilename , result)
            // writeFile(targetfilename , Buffer.from(result.content))
            .then(() => {
                res.status('200').json({ message : 'PDF file ' + filename + ' received and stored on filesystem.' });
            })  // for test only   ???
        }
        else {
            console.log("---- Error with the access of the stored blob: ", result);
            res.status('400').json({message : 'Error with the access of the stored blob at ' + filename});
        }
    })
    .catch((err) => {
        console.log(err);
        res.status('400').json({ message : err.message });
    });
}


module.exports.listFolderTest = function(req, res)
{
console.log(">>>>>>> listFolderTest is started");

    let tenantId = generateSupplierTenantId("ABC");
    let filename = req.query.path;

    this.blob.listEntries(tenantId, filename)
    .then((entries) => {
console.log("Result: ", entries);

        res.status('200').json({ files : entries});
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
module.exports.forwardPdfExample = function(supplierId) {

console.log(">>>>>> Pushing the PDF example that was uploaded for supplier " + supplierId + " to ???");

    // TODO: What to do???

    let tenantId = generateSupplierTenantId(supplierId);
    let filename = "einvoice/InvoiceTemplate.pdf";
console.log(">>>>>>>>>>2 " + tenantId, filename);

/*
    return this.blob.listEntries(tenantId, "einvoice")
    .then((entries) => {
        console.log("--- ", entries);
        for (let val of entries) {
            console.log("--->> ", val);
        }
*/
console.log(">>>>>>>>>>3 Readfile...");

    return this.blob.readFile(tenantId, filename)
    .then((buffer) => {
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

    return {supplierId: supplierId, customerId, customerId};
}

function check4BusinessPartner(req, predefinedCustomerId, predefinedSupplierId) {
    bp = determineBusinessPartner(req, predefinedCustomerId, predefinedSupplierId);

    // only for testing ??? ???
    if (!bp.supplierId) {
        supplierId = 'ABC';    // ??? Remove - only for test!
        customerId = req.params.relatedTenantId;
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
        return this.forwardPdfExample(supplierId);
    })
    .then(() => {
        res.status(200);
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

console.log(">> sendOneVoucher - businesspartner: ", bp.supplierId, bp.customerId);

        return new Promise((resolve, reject) => {
            if (!bp.customerId && !bp.supplierId) {
                resolve(Voucher.getOne());
            }
            if (!bp.customerId) {
                resolve(Voucher.getOne(bp.supplierId));
            }
            else {
                resolve(Voucher.getOne(bp.customerId, bp.supplierId));
            }
        })
        .then(data => {
console.log(">> sendOneVoucher - data: ", data);
            (data && res.json(data)) || res.status('404').json({ message : 'No Voucher object found for the supplier-customer pair ' + bp.supplierId + "+" + bp.customerId});
        })
    }
    catch(e) {
        res.status('400').json({message: e.message});
    }
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

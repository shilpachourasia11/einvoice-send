'use strict'

const Promise = require('bluebird');
const RedisEvents = require('ocbesbn-redis-events');
const Api = require('../api.js');
const Multer = require('multer');

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
    return Api.init(db).then(() =>
    {
        this.events = new RedisEvents({ consul : { host : 'consul' } });

        // app.use(checkContentType);  ???


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
        app.post('/api/config/inchannel/file',
          upload.single('file'),
          (req, res) => this.addPdfExample(req, res));

        app.get('/api/test', (req, res) => res.json(req.opuscapita.userData()));
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

    Api.inChannelConfigExists(supplierId).then(exists =>
    {
        if(exists)
        {
            res.status('409').json({ message : 'This supplier already owns an in-channel configuration.' });
        }
        else
        {
            var obj = req.body || { }

            obj.supplierId = supplierId;
            obj.createdBy = req.opuscapita.userData('id') || req.body.createdBy;

            return Api.addInChannelConfig(obj, true)
                .then(config => this.events.emit(config, 'inChannelConfig.added').then(() => config))
                .then(config => res.status(202).json(config));
        }
    })
    .catch(e => res.status('400').json({ message : e.message }));
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

      // TODO: As soon as the blob modul is available, then store the PDF in the blob. (And then?)
      //       The storage in the file system is (so far) just for test purpose.
      writeFile("./" + filename, buffer)
      .then(() => {  // No resonpose
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

function checkContentType(req, res, next)
{
    var method = req.method.toLowerCase();
    var contentType = req.headers['content-type'] && req.headers['content-type'].toLowerCase();

    if(method !== 'get' && contentType !== 'application/json')
        res.status(400).json({ message : 'Invalid content type. Has to be "application/json".' });
    else
        next();
}

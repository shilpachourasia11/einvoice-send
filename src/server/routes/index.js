'use strict'

const Promise = require('bluebird');
const RedisEvents = require('ocbesbn-redis-events');
const Api = require('../api.js');

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

        app.use(checkContentType);

        app.get('/api/config/inchannel/current', (req, res) => this.sendInChannelConfig(req, res, true));
        app.get('/api/config/inchannel/:supplierId', (req, res) => this.sendInChannelConfig(req, res));

        app.put('/api/config/inchannel/current', (req, res) => this.updateInChannelConfig(req, res, true));
        app.put('/api/config/inchannel/:supplierId', (req, res) => this.updateInChannelConfig(req, res));

        app.post('/api/config/inchannel/current', (req, res) => this.addInChannelConfig(req, res, true));
        app.post('/api/config/inchannel', (req, res) => this.addInChannelConfig(req, res));
        app.get('/api/test', (req, res) => res.json(req.userData()));
        app.get('/api/test1', (req, res) => res.json('Test'));
    });
}

module.exports.sendInChannelConfig = function(req, res, useCurrentUser)
{
    var supplierId = useCurrentUser ? req.opuscapita.userData('supplierId') : req.params.supplierId;

    Api.inChannelConfigExists(supplierId).then(exists =>
    {
        if(exists)
        {
            Api.getInChannelConfig(supplierId).then(config =>
            {
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
    var supplierId = useCurrentUser ? req.opuscapita.userData('supplierId') : req.body.supplierId;

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
            obj.createdBy = req.opuscapita.userData('id');

            return Api.addInChannelConfig(obj, true)
                .then(config => this.events.emit(config, 'inChannelConfig.added').then(() => config))
                .then(config => res.status(202).json(config));
        }
    })
    .catch(e => res.status('400').json({ message : e.message }));
}

module.exports.updateInChannelConfig = function(req, res, useCurrentUser)
{
    var supplierId = useCurrentUser ? req.opuscapita.userData('supplierId') : req.params.supplierId;

    Api.inChannelConfigExists(supplierId).then(exists =>
    {
        if(exists)
        {
            var obj = req.body || { }

            obj.supplierId = supplierId;
            obj.updatedBy = req.opuscapita.userData('id');

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

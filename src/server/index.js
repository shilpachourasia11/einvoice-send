'use strict';

const Logger = require('ocbesbn-logger'); // Logger
const db = require('ocbesbn-db-init'); // Database
const server = require('ocbesbn-web-init'); // Web server
const bouncer = require('ocbesbn-bouncer') // ACL bouncer

const logger = new Logger();
logger.redirectConsoleOut(); // Force anyone using console outputs into Logger format.

// Basic database and web server initialization.
// See database : https://github.com/OpusCapitaBusinessNetwork/db-init
// See web server: https://github.com/OpusCapitaBusinessNetwork/web-init
db.init({
    retryCount : 10,
    retryTimeout : 2000,
    mode : db.Mode.Dev,
    retryTimeout : 2500,
    retryCount : 10,
    consul : {
        host : 'consul'
    },
    data : {
        addTestData : true
    }
})
.then((db) => server.init({
    server : {
        port : process.env.PORT || 3007,
        mode : server.Server.Mode.Dev,
        staticFilePath : './src/client/static',
        indexFilePath : require('path').resolve('./src/client/dist/index.html'),
        middlewares : [ bouncer({
            host : 'consul',
            serviceName : 'einvoice-send',
            acl : require('./acl.json'),
            aclServiceName : 'acl'
        }).Middleware ],
        webpack : {
            useWebpack : true
        }
    },
    routes : {
        dbInstance : db
    }
}))
.catch((e) => { server.end(); throw e; });

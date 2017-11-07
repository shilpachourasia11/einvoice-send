'use strict';

const Logger = require('ocbesbn-logger'); // Logger
const db = require('ocbesbn-db-init'); // Database
const server = require('ocbesbn-web-init'); // Web server

const isProduction = process.env.NODE_ENV === 'production';
const logger = new Logger();

if(isProduction)
    logger.redirectConsoleOut(); // Force anyone using console outputs into Logger format.

// Basic database and web server initialization.
// See database : https://github.com/OpusCapitaBusinessNetwork/db-init
// See web server: https://github.com/OpusCapitaBusinessNetwork/web-init
db.init({
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
        staticFilePath : './src/server/static',
        indexFilePath : process.cwd() + '/src/server/templates/index.html',
        indexFileRoutes : [ '/', '/pdf', '/pdf/*', '/paper', '/paper/*', '/einvoice', '/einvoice/*', '/keyin', '/keyin/*', '/key-in', '/key-in/*' ],
        enableBouncer : isProduction,
        webpack : {
            useWebpack : !isProduction,
            configFilePath : process.cwd() + '/webpack.development.config.js'
        }
    },
    routes : {
        dbInstance : db
    }
}))
.catch((e) => { server.end(); throw e; });

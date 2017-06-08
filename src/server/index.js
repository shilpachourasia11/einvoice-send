'use strict';

const server = require('ocbesbn-web-init'); // Web server
const db = require('ocbesbn-db-init'); // Database

// Basic database and web server initialization.
// See database : https://github.com/OpusCapitaBusinessNetwork/db-init
// See web server: https://github.com/OpusCapitaBusinessNetwork/web-init
db.init({
    mode : db.Mode.Dev,
    consul : {
        host : 'consul'
    },
    data : {
        addTestData : true
    }
})
.then((db) => server.init({
    server : {
        port : 3007,
        mode : server.Server.Mode.Dev,
        staticFilePath : './src/client/static',
        indexFilePath : require('path').resolve('./src/client/dist/index.html'),
        webpack : {
            useWebpack : true
        }
    },
    routes : {
        dbInstance : db
    }
}))
.catch((e) => { server.end(); throw e; });

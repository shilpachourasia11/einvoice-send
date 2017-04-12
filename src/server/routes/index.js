'use strict'

const Promise = require('bluebird');
const pathJs = require('path');
const countries = require('./countries');
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import template from '../../templates/app';
import getClientModule from '../scripts/getClientModule';

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
    // Register routes here.
    // Use the passed db parameter in order to use Epilogue auto-routes.
    // Use require in order to separate routes into multiple js files.
    // app.get('/hello', (req, res) => res.send('Hello world!'));

    // countries(app);

    app.get(/^\/.*/, (req, res) => {
      const App = getClientModule(app, 'App.js');
      const context = {};
      const appHtml = renderToString(
        <StaticRouter location={req.url} context={context}>
          <App/>
        </StaticRouter>
      );

      if (context.url) {
        res.redirect(302, context.url);
      } else {
        const html = template({ body: appHtml, title: 'A title' });
        res.set('content-type', 'text/html');
        res.send(html);
      }
    });

    // Always return a promise.
    return Promise.resolve();
}

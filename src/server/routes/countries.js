const ServiceClient = require('ocbesbn-service-client');
import React from 'react';
import { renderToString } from 'react-dom/server';
import Countries from '../../client/app/Countries';
import { transformFileSync } from 'babel-core';
import template from '../../templates/app';

module.exports = function(app) {
  var client = new ServiceClient({ consul : { host : 'consul' } });

  app.get('/countries', function(request, response) {
    var countries_array = [{ name: 'Finland' }, { name: 'Germany' }];
    response.send(template({
      title: 'Countries from server',
      body: renderToString(<Countries />),
    }));
  });
}

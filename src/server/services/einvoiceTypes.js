const http = require("http");
const querystring = require("querystring");
const util = require("util");
const Promise = require("bluebird");


function _call(options, data) {

  return new Promise((resolve, reject) => {
    callback = function(res) {
      var data = "";

      res.on('data', function (chunk) {
        data += chunk;
      });

      res.on('end', function() {

        // console.log(">> Status = ", res.statusCode);

        if (res.statusCode == 302) {
          // console.log(">> Response Location: ", res.headers.location);
          resolve(res.headers.location);
        }
        if (res.statusCode >= 100 && res.statusCode < 400) {
          resolve(data);
        }
        else {
          reject(new Error(data));
        }
      });
    }

    var req = http.request(options, callback)
    // req.on('Error', ...)
    if (data) {
      req.write(data);
    }
    req.end()
  });
}

function getSoftwareAGEInvoiceTypesBasicAuth() {

  var username = "arne";
  var password = "manage";

  //  header Authencation:
  //  1. Header parameter: var authentication = "Basic " + new Buffer(username + ":" + password).toString("base64");
  //  2. HTTP Request option auth: >auth: username + ":" + password<

  // http://193.26.193.8:11054/rest/opuscapitarest/apis/invoiceFormats
  var options = {
    host: "193.26.193.8",
    port: "11054",
    path: "/rest/opuscapitarest/apis/invoiceFormats",
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'    // 'Content-Type': 'text/xml'
    },
    auth: username + ":" + password
  };

  // console.log(">> HTTP Basic Authentication options:\n", options);
  return _call(options);
}

function getSoftwareAGEInvoiceTypesOAuth2FixToken() {

  // http://193.26.193.8:11054/rest/opuscapitarest/apis/invoiceFormats
  var options = {
    host: "193.26.193.8",
    port: "11054",
    path: "/rest/opuscapitarest/apis/invoiceFormats",
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: "Bearer 043a96208d1617b5b605fffffff9d214"
    },
  };

  // console.log(">> OAuth2 options:\n", options);
  return _call(options);
}


function getToken(globalOptions) {
  /* 1. Call the Authorization page

  curl "http://193.26.193.8:11054/invoke/pub.oauth/authorize?response_type=code&client_id=7b05bb40dc0d11f8bb1afffffffa0100&scope=OpusCapita"
  */

  // -> omitted, because no necessary information is required.


  /* 2. Post the Authorization page

  curl -i -u arne:manage -d "client_id=7b05bb40dc0d11f8bb1afffffffa0100" -d "redirect_uri=http://193.26.193.8:11054/invoke/authServer/exchangeAuthCodeForToken" -d "scope=OpusCapita" -d "approved=true" -d "response_type=code" -d "selectScope=OpusCapita" -d "approve=Approve" "http://193.26.193.8:11054/invoke/wm.server.oauth/approve"

  Forwarding (HTTP 302) to res.headers.location (see _call method).
  */
  var data = querystring.stringify({
    'client_id': '7b05bb40dc0d11f8bb1afffffffa0100',
    'redirect_uri': 'http://193.26.193.8:11054/invoke/authServer/exchangeAuthCodeForToken',
    'scope': 'OpusCapita',
    'state': '',
    'approved': 'true',
    'response_type': 'code',
    'selectScope': 'OpusCapita',
    'approve': 'Approve'
  });

  var optionsApprove = {
    method: 'POST',
    path: "/invoke/wm.server.oauth/approve",
    auth: "arne:manage",
    headers: {
      'Content-Type': "application/x-www-form-urlencoded",
      'Content-Length': Buffer.byteLength(data)
    }
  }
  var options = Object.assign({}, globalOptions, optionsApprove)

  // console.log(">> options: ", options);
  // console.log(">> data: ", data);

  return _call(options, data)
  .then((data) => {
    // console.log(">> Approve", data);
    var url = data.replace(/http:\/\/[^\/]*/, "");  // remove "http://", host and port

    /* 3. Request the token with the provided code.
    curl -u arne:manage "http://193.26.193.8:11054/invoke/authServer/exchangeAuthCodeForToken?code=e4078c80a1da12c0a9f2fffffffdaacf&grant_type=authorization_code&redirect_uri=http%253A%252F%252F193.26.193.8%253A11054%252Finvoke%252FauthServer%252FexchangeAuthCodeForToken&scope=OpusCapita"
    */
    var optionsECFT = {
      path: url,
      auth: "arne:manage"
    }
    var options = Object.assign({}, globalOptions, optionsECFT);

    // console.log(">> options: ", options);
    return _call(options);
  })
  .then((data) => {
    // console.log(">> Token-Info: ", data);

    var token = JSON.parse(data).access_token;
    // console.log(">> Token: ", token);
    return token;
  });
}


function getSoftwareAGEInvoiceTypesOAuth2() {

  var globalOptions = {
    host: "193.26.193.8",
    port: "11054",
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  return getToken(globalOptions)
  .then((token) => {
    var optionsIF = {
      path: "/rest/opuscapitarest/apis/invoiceFormats",
      headers: {
        'Content-Type': 'application/json',
        Authorization: "Bearer " + token
      }
    };

    var options = Object.assign({}, globalOptions, optionsIF);
    // console.log(">> OAuth2 options:\n", options);
    return _call(options);
  })
}




function getEInvoiceTypes() {

console.log(">> getEInvoiceTypes was called!");

  return getSoftwareAGEInvoiceTypesOAuth2()
  .then((data) => {
/*
    var types = JSON.parse(data).invoiceFormats.invoiceFormat.map((item) => {
      return item.formatName;
    });
    return types;
*/
    return JSON.parse(data).invoiceFormats.invoiceFormat;
  });
}

module.exports = {
  getEInvoiceTypes: getEInvoiceTypes
};

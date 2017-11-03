import ajax from 'superagent-bluebird-promise';


module.exports.status = {
    new: "new",
    approved: "approved",
    activated: "activated"
}


module.exports.get = (supplierId, customerId) => {
    return ajax.get('/einvoice-send/api/config/inchannelcontracts/c_' + customerId + '/s_' + supplierId)
        .promise();
}

module.exports.add = (supplierId, obj) => {
    // console.log("*** addInChannelContract -> supplierId = " + supplierId + ", obj: ", obj);
    status = status || 'new';
    return ajax.post('/einvoice-send/api/config/inchannelcontracts/s_' + supplierId)
        .set('Content-Type', 'application/json')
        .send(obj)
        .promise();
}

module.exports.update = (supplierId, customerId, obj) => {
    // console.log("*** updateInChannelContract -> customerId = " + customerId + ", suppierId: " + supplierId + ", obj: ", obj);
    return ajax.put('/einvoice-send/api/config/inchannelcontracts/c_' + customerId + '/s_' + supplierId)
        .set('Content-Type', 'application/json')
        .send(obj)
        .promise();
}

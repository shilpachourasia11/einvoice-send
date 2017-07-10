import ajax from 'superagent-bluebird-promise';


module.exports.status = {
    new: "new",
    approved: "approved",
    activated: "activated"
}

module.exports.types = {
    paper         : "paper",
    pdf           : "pdf",
    eInvoice      : "eInvoice",
    supplierPortal: "supplierPortal"
}


module.exports.get = (supplierId) =>
{
    return ajax.get('/einvoice-send/api/config/inchannels/' + supplierId)
        .promise();
}

module.exports.add = (supplierId, obj) =>
{
    obj.supplierId = supplierId;
    // console.log("++ addInChannelConfig -> obj: ", obj);
    return ajax.post('/einvoice-send/api/config/inchannels')
        .set('Content-Type', 'application/json')
        .send(obj)
        .promise();
}

module.exports.update = (supplierId, obj) => {
    obj.supplierId = supplierId;
    // console.log("++ updateInChannelConfig -> obj: ", obj);
    return ajax.put('/einvoice-send/api/config/inchannels/' + supplierId)
        .set('Content-Type', 'application/json')
        .send(obj)
        .promise();
}

module.exports.approve = (supplierId) => {
    return ajax.put('/einvoice-send/api/config/inchannels/' + supplierId + '/finish')
        .set('Content-Type', 'application/json')
        .promise()
}

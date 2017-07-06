import ajax from 'superagent-bluebird-promise';


module.exports.get = (customerId, supplierId) => {
    return ajax.get('/einvoice-send/api/config/inchannelcontracts/c_' + customerId + '/s_' + supplierId)
        .promise();
}

module.exports.add = (customerId, supplierId, inputType, voucherId, status) => {
console.log("++ addInChannelContract -> customerId =" + customerId + ", inputType = " + inputType + ", status = " + status);
    status = status || 'new';
    return ajax.post('/einvoice-send/api/config/inchannelcontracts')
        .set('Content-Type', 'application/json')
        .send({
            customerId : customerId,
            inputType : inputType,
            status : status,
            voucherId: inputType
        })
        .promise();
}

module.exports.update = (customerId, supplierId, inputType, status) => {
console.log("++ updateInChannelContract -> customerId / status: ", customerId, status);
    return ajax.put('/einvoice-send/api/config/inchannelcontracts/c_' + customerId + '/s_' + supplierId)
        .set('Content-Type', 'application/json')
        .send({
            customerId : customerId,
            inputType : inputType,
            status : status
        })
        .promise();
}

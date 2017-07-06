import ajax from 'superagent-bluebird-promise';

module.exports.add = (customerId, supplierId, status) => {
console.log("++ addInChannelContract -> customerId =" + customerId + ", status = " + status);
    status = status || 'new';
    return ajax.post('/einvoice-send/api/config/inchannelcontracts')
        .set('Content-Type', 'application/json')
        .send({
            customerId : customerId,
            inputType : 'paper',
            status : status,
            voucherId: this.props.voucher.voucherId
        })
        .promise();
}

module.exports.update = (customerId, supplierId, status) => {
console.log("++ updateInChannelContract -> customerId / status: ", customerId, status);
    return ajax.put('/einvoice-send/api/config/inchannelcontracts/' + customerId + '/' + supplierId)
        .set('Content-Type', 'application/json')
        .send({
            customerId : customerId,
            inputType : 'paper',
            status : status
        })
        .promise();
}

import ajax from 'superagent-bluebird-promise';

module.exports.get = (supplierId) =>
{
    return ajax.get('/einvoice-send/api/config/inchannels/' + supplierId)
        .set('Content-Type', 'application/json')
        .promise();
}

module.exports.add = (supplierId) =>
{
console.log("++ addInChannelConfig -> paper/new - VoucherId: ", this.props.voucher);
    return ajax.post('/einvoice-send/api/config/inchannels')
        .set('Content-Type', 'application/json')
        .send({
            supplierId : supplierId,
            inputType : 'paper',
            status: 'new',
            voucherId: this.props.voucher.voucherId
        })
        .promise();
}

module.exports.update = (supplierId, values) => {
console.log("++ updateInChannelConfig -> values: ", values);
    return ajax.put('/einvoice-send/api/config/inchannels/' + supplierId)
        .set('Content-Type', 'application/json')
        .send(values).promise();
}

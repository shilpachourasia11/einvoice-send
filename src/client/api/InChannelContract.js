import ajax from 'superagent-bluebird-promise';

class InChannelContract
{
    static get(supplierId, customerId) {
        return ajax.get('/einvoice-send/api/config/inchannelcontracts/c_' + customerId + '/s_' + supplierId)
            .promise();
    }

    static add(supplierId, obj) {
        status = status || 'new';

        return ajax.post('/einvoice-send/api/config/inchannelcontracts/s_' + supplierId)
            .set('Content-Type', 'application/json')
            .send(obj)
            .promise();
    }

    static update(supplierId, customerId, obj) {
        return ajax.put('/einvoice-send/api/config/inchannelcontracts/c_' + customerId + '/s_' + supplierId)
            .set('Content-Type', 'application/json')
            .send(obj)
            .promise();
    }
}

InChannelContract.status = {
    new: "new",
    approved: "approved",
    activated: "activated"
}

export default InChannelContract;

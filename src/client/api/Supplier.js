import ajax from 'superagent-bluebird-promise';

class Supplier
{
    static updateCapabilities(supplierId)
    {
        let capabilityId = 'eInvoice-send'
        return ajax.post('/einvoice-send/api/suppliers/' + supplierId + '/' + capabilityId)
            .set('Content-Type', 'application/json')
            .promise();
    }
}

export default Supplier;

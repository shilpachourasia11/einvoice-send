const ajax = require('superagent-bluebird-promise');

class InChannelConfig
{
    static getNextStatus(oldStatus, actionStatus) {
        let statusPrio = ["new", "approved", "configured", "activated"];
        if (statusPrio.indexOf(oldStatus) > statusPrio.indexOf(actionStatus)) {
            return oldStatus;
        }
        else {
            return actionStatus;
        }
    }

    static get(supplierId) {
        return ajax.get('/einvoice-send/api/config/inchannels/' + supplierId)
            .set('Content-Type', 'application/json')
            .promise();
    }

    static add(supplierId, obj) {
        obj.supplierId = supplierId;
        // console.log("++ addInChannelConfig -> obj: ", obj);
        return ajax.post('/einvoice-send/api/config/inchannels')
            .set('Content-Type', 'application/json')
            .send(obj)
            .promise();
    }

    static update(supplierId, obj) {
        obj.supplierId = supplierId;
        // console.log("++ updateInChannelConfig -> obj: ", obj);
        return ajax.put('/einvoice-send/api/config/inchannels/' + supplierId)
            .set('Content-Type', 'application/json')
            .send(obj)
            .promise();
    }

    static activate(supplierId, obj = {}) {
        return ajax.put('/einvoice-send/api/config/inchannels/' + supplierId + '/finish')
            .set('Content-Type', 'application/json')
            .send(obj)
            .promise()
    }

}

InChannelConfig.status = {
    new: "new",
    approved: "approved",
    configured: "configured",
    activated: "activated"
}

InChannelConfig.types = {
    paper   : "paper",
    pdf     : "pdf",
    eInvoice: "einvoice",
    keyIn   : "keyIn"
}

export default InChannelConfig;

'use strict'

const Promise = require('bluebird');
const extend = require('extend');

module.exports.init = function(db)
{
    this.db = db;
    return Promise.resolve(this);
}

module.exports.exists = function(customerId, supplierId)
{
    return this.db.models.Voucher.findOne(
        {where: {customerId: customerId, supplierId: supplierId}})
    .then(data => {
        return data && data.supplierId === supplierId;
    });
}

module.exports.get = function(customerId, supplierId)
{
    return this.db.models.Voucher.findOne(
        {where: {customerId: customerId, supplierId: supplierId}})
    .then((data) => {
        return data;
    });
}

module.exports.getOneBySupplier = function(supplierId)  // ??? why not covered by method above?
{
    return this.db.models.Voucher.findOne(
        {where: {supplierId: supplierId}})
    .then((data) => {
        return data;
    });
}

module.exports.add = function(data)
{
    delete data.changedBy;
    delete data.changedOn;
    return this.db.models.Voucher.create(data);
}

module.exports.update = function(customerId, supplierId, data)
{
    ['customerId', 'supplierId', 'createdOn', 'createdBy' ].forEach(key => delete data[key]);
    return this.db.models.Voucher.update(data, {where: {customerId: customerId, supplierId:supplierId}});
}

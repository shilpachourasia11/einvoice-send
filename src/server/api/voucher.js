'use strict'

const Promise = require('bluebird');
const extend = require('extend');

module.exports.init = function(db)
{
    this.db = db;
    return Promise.resolve(this);
}

/**
 * [description]
 * @param  {[type]} supplierId [description]
 * @param  {[type]} customerId [description]
 * @return {Boolean}            Promise
 */
module.exports.exists = function(customerId, supplierId)
{
    // Try finding an existing config...
    return this.db.models.Voucher.findOne(
        {where: {customerId: customerId, supplierId: supplierId}})
    .then(data => {
        return data && data.supplierId === supplierId;
    });
}

module.exports.get = function(customerId, supplierId)
{
    // Try finding an existing config...
    return this.db.models.Voucher.findOne(
        {where: {customerId: customerId, supplierId: supplierId}})
    .then((data) => {
// console.log(">>>>>> findOne 2: ", data.dataValues);
        return data;
    });
}

module.exports.getOneBySupplier = function(supplierId)  // ??? why not covered by method above?
{
    // Try finding an existing config...
    return this.db.models.Voucher.findOne(
        {where: {supplierId: supplierId}})
    .then((data) => {
// console.log(">>>>>> findOne 1: ", data.dataValues);
        return data;
    });
}


// ???  only for test ???
module.exports.getAny = function()  // ??? why not covered by method above?
{
    // Try finding an existing config...
    return this.db.models.Voucher.findOne()
    .then((data) => {
// console.log(">>>>>> findOne 0: ", data.dataValues);
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

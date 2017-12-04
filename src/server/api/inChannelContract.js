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
    return this.db.models.InChannelContract.findOne(
        {where: {supplierId: supplierId, customerId: customerId}})
    .then(data => {
        return data && data.supplierId === supplierId;
    });
}

module.exports.get = function(customerId, supplierId)
{
    // Try finding an existing config...
    return this.db.models.InChannelContract.findOne(
        {where: {supplierId: supplierId, customerId: customerId}})
    .then((data) => {
        return data;
    });
}

module.exports.getAll = function(searchObj)
{
    for(var key in searchObj)
        if(Array.isArray(searchObj[key]))
            searchObj[key] = { '$in' : searchObj[key] };

    return this.db.models.InChannelContract.findAll({
        where : searchObj,
        order: [['changedOn', 'ASC']]
    });
}

module.exports.add = function(data)
{
    delete data.changedBy;
    delete data.changedOn;
    return this.db.models.InChannelContract.create(data);
}

module.exports.update = function(customerId, supplierId, data)
{
    ['customerId', 'supplierId', 'createdOn', 'createdBy' ].forEach(key => delete data[key]);
    data.changedOn = new Date();
    return this.db.models.InChannelContract.update(data, {where: {customerId: customerId, supplierId:supplierId}})
    .then(updateData => this.get(customerId, supplierId));
}

module.exports.delete = function(customerId, supplierId)
{
    return this.db.models.InChannelContract.destroy({where: {customerId: customerId, supplierId:supplierId}});
}

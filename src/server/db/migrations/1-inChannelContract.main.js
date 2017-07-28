'use strict'

const DataTypes = require('sequelize');
const Promise = require('bluebird');

module.exports.up = function(db, config)
{
    const customerSupplierId = db.queryInterface.addColumn(
        'InChannelContract',
        'customerSupplierId', {
            type: DataTypes.STRING(30),
            allowNull : true
        }
    );

    const changedBy = db.queryInterface.changeColumn(
        'InChannelContract',
        'changedBy',
        {
            type : DataTypes.STRING(60),
            allowNull : true
        }
    );

    const changedOn = db.queryInterface.changeColumn(
        'InChannelContract',
        'changedOn',
        {
            type : DataTypes.DATE(),
            allowNull : false,
            defaultValue : DataTypes.NOW
        }
    );

    return Promise.all([customerSupplierId, changedBy, changedOn]);
}


module.exports.down = function(db, config)
{
    const customerSupplierId = db.queryInterface.removeColumn(
        'InChannelContract',
        'customerSupplierId'
    );

    const changedBy = db.queryInterface.changeColumn(
        'InChannelContract',
        'changedBy',
        {
            type : DataTypes.STRING(60),
            allowNull : false,
            defaultValue : ''
        }
    );

    const changedOn = db.queryInterface.changeColumn(
        'InChannelContract',
        'changedOn',
        {
            type : DataTypes.DATE(),
            allowNull : true
        }
    );

    return Promise.all([customerSupplierId, changedBy, changedOn]);
}

'use strict'

const Promise = require('bluebird');
const DataTypes = require('sequelize');

module.exports.init = function(db, config)
{
    /**
     * Data model representing an invoice send configuration.
     * @class InvoiceSendConfig
     */
    var InChannelConfig = db.define('InChannelConfig',
    /** @lends InvoiceSendConfig */
    {
        supplierId : {
            type : DataTypes.STRING(30),
            allowNull : false,
            primaryKey : true
        },
        billingModelId : {
            type : DataTypes.STRING(30),
            allowNull : true
        },
        inputType : {
            type : DataTypes.STRING(30),
            allowNull : true
        },
        status : {
            type : DataTypes.STRING(100),
            allowNull : false,
            defaultValue : 'new'
        },
        voucherId: {
            type: DataTypes.INTEGER,
            allowNull : true
        },
        createdBy : {
            type : DataTypes.STRING(60),
            allowNull : false
        },
        changedBy : {
            type : DataTypes.STRING(60),
            allowNull : false,
            defaultValue : ''
        },
        createdOn : {
            type : DataTypes.DATE(),
            allowNull : false,
            defaultValue : DataTypes.NOW
        },
        changedOn : {
            type : DataTypes.DATE(),
            allowNull : true
        }
    }, {
        updatedAt : 'changedOn',
        createdAt : 'createdOn',
        freezeTableName : true
    });

    return Promise.resolve();
}

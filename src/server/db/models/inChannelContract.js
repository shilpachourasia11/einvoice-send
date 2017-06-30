'use strict'

const Promise = require('bluebird');
const DataTypes = require('sequelize');

module.exports.init = function(db, config)
{
    /**
     * Data model representing an inChannelContract between a supplier and a customer.
     */
    var InChannelContract = db.define('InChannelContract',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        supplierId : {
            type : DataTypes.STRING(30),
            allowNull : false
        },
        customerId : {
            type : DataTypes.STRING(30),
            allowNull : false
        },
        billingModelId : {
            type : DataTypes.STRING(30),
            allowNull : true
        },
        inputType : {
            type : DataTypes.STRING(30),
            allowNull : true
        },
        // new, approved, inWork, activated
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

'use strict'

const Promise = require('bluebird');
const DataTypes = require('sequelize');

module.exports.init = function(db, config)
{
    /**
     * Data model representing a Voucher by a customer for a supplier.
     */
    var voucher = db.define('Voucher',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        customerId : {
            type : DataTypes.STRING(30),
            allowNull : false
        },
        supplierId : {
            type : DataTypes.STRING(30),
            allowNull : false
        },
        billingModelId : {
            type : DataTypes.STRING(30),
            allowNull : true
        },
        // new, approved
        status : {
            type : DataTypes.STRING(100),
            allowNull : false,
            defaultValue : 'new'
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

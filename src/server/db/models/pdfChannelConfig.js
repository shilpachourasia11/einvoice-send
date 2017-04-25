'use strict'

const Promise = require('bluebird');
const DataTypes = require('sequelize');

module.exports.init = function(db, config)
{
    /**
     * Data model representing an invoice send configuration.
     * @class PdfChannelConfig
     */
    var PdfChannelConfig = db.define('PdfChannelConfig',
    /** @lends PdfChannelConfig */
    {
        supplierId : {
            type : DataTypes.STRING(30),
            allowNull : false,
            primaryKey : true
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
        createdAt : 'createdOn'
    });

    return Promise.resolve();
}

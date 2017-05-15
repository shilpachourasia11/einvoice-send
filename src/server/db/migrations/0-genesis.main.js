'use strict'

const DataTypes = require('sequelize');
const Promise = require('bluebird');

/**
 * Applies migrations for databse tables and data.
 * If all migrations were successul, this method will never be executed again.
 * To identify which migrations have successfully been processed, a migration's filename is used.
 *
 * @param {object} data - [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - A model property for database models and everything from [config.data]{@link https://github.com/OpusCapitaBusinessNetwork/db-init} passed when running the db-initialization.
 * @returns {Promise} [Promise]{@link http://bluebirdjs.com/docs/api-reference.html}
 * @see [Applying data migrations]{@link https://github.com/OpusCapitaBusinessNetwork/db-init#applying-data-migrations}
 */
module.exports.up = function(db, config)
{
    var InChannelConfig = db.queryInterface.createTable('InChannelConfig', {
        supplierId : {
            type : DataTypes.STRING(30),
            allowNull : false,
            primaryKey : true
        },
        billingModelId : {
            type : DataTypes.STRING(30),
            allowNull : false
        },
        inputType : {
            type : DataTypes.STRING(30),
            allowNull : false
        },
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
    });

    var EInvoiceChannelConfig = db.queryInterface.createTable('EInvoiceChannelConfig', {
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
    });

    var PdfChannelConfig = db.queryInterface.createTable('PdfChannelConfig', {
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
    });

    var SupplierPortalConfig = db.queryInterface.createTable('SupplierPortalConfig', {
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
    });

    return Promise.all([
        InChannelConfig,
        EInvoiceChannelConfig,
        PdfChannelConfig,
        SupplierPortalConfig
    ]);
}

/**
 * Reverts all migrations for databse tables and data.
 * If the migration process throws an error, this method is called in order to revert all changes made by the up() method.
 *
 * @param {object} data - [Sequelize]{@link https://github.com/sequelize/sequelize} instance.
 * @param {object} config - A model property for database models and everything from [config.data]{@link https://github.com/OpusCapitaBusinessNetwork/db-init} passed when running the db-initialization.
 * @returns {Promise} [Promise]{@link http://bluebirdjs.com/docs/api-reference.html}
 * @see [Applying data migrations]{@link https://github.com/OpusCapitaBusinessNetwork/db-init#applying-data-migrations}
 */
module.exports.down = function(db, config)
{
    return Promise.all([
        db.queryInterface.dropTable('InChannelConfig'),
        db.queryInterface.dropTable('EInvoiceChannelConfig'),
        db.queryInterface.dropTable('PdfChannelConfig'),
        db.queryInterface.dropTable('SupplierPortalConfig')
    ])
}

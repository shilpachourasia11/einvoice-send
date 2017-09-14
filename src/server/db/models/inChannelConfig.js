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
        },
        rejectionEmail: {
            type:DataTypes.STRING(30),
            allowNull:true
        },
        status: {
            type:DataTypes.STRING(100),
            allowNull:false,
            defaultValue:'new'
        }
    }, {
        updatedAt : 'changedOn',
        createdAt : 'createdOn',
        freezeTableName : true,
        // classMethods: {
        //   associate: function(db) {
        //     PdfChannelConfig.belongsTo(db.InChannelConfig, {targetKey: 'supplierId'});
        //   }
        // }
    });

    /**
     * Data model representing an invoice send configuration
     * @class PaperChannelConfig
     */
    var PaperChannelConfig = db.define('PaperChannelConfig',
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
        },
        status: {
            type:DataTypes.STRING(100),
            allowNull:false,
            defaultValue:'new'
        }
    }, {
        updatedAt : 'changedOn',
        createdAt : 'createdOn',
        freezeTableName : true
    });

    /**
     * Data model representing an invoice send configuration.
     * @class EInvoiceChannelConfig
     */
    var EInvoiceChannelConfig = db.define('EInvoiceChannelConfig',
    /** @lends EInvoiceChannelConfig */
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
        },
        intention : {
            type:DataTypes.BOOLEAN,
            allowNull:true
        },
        status: {
            type:DataTypes.STRING(100),
            allowNull:false,
            defaultValue:'new'
        }
    }, {
        updatedAt : 'changedOn',
        createdAt : 'createdOn',
        freezeTableName : true
    });

    /**
     * Data model representing an invoice send configuration.
     * @class SupplierPortalConfig
     */
    var SupplierPortalConfig = db.define('SupplierPortalConfig',
    /** @lends SupplierPortalConfig */
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
        },
        status: {
            type:DataTypes.STRING(100),
            allowNull:false,
            defaultValue:'new'
        }
    }, {
        updatedAt : 'changedOn',
        createdAt : 'createdOn',
        freezeTableName : true
    });

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
        customerSupplierId: {
            type : DataTypes.STRING(30),
            allowNull : true
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
            allowNull : true
        },
        createdOn : {
            type : DataTypes.DATE(),
            allowNull : false,
            defaultValue : DataTypes.NOW
        },
        changedOn : {
            type : DataTypes.DATE(),
            allowNull : true,
            defaultValue : DataTypes.NOW
        }
    }, {
        updatedAt : 'changedOn',
        createdAt : 'createdOn',
        freezeTableName : true
    });

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
        customerSupplierId: {
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

    PdfChannelConfig.belongsTo(
        InChannelConfig, {
            targetKey: "supplierId", 
            foreignKey: "supplierId"
        }
    );
    PaperChannelConfig.belongsTo(
        InChannelConfig, {
            targetKey: "supplierId", 
            foreignKey: "supplierId"
        }
    );
    EInvoiceChannelConfig.belongsTo(
        InChannelConfig, {
            targetKey: "supplierId", 
            foreignKey: "supplierId"
        }
    );
    SupplierPortalConfig.belongsTo(
        InChannelConfig, {
            targetKey: "supplierId", 
            foreignKey: "supplierId"
        }
    );

    InChannelConfig.hasOne(
        PdfChannelConfig, {
            targetKey: "supplierId", 
            foreignKey: "supplierId"
        }
    );
    InChannelConfig.hasOne(
        PaperChannelConfig, {
            targetKey: "supplierId", 
            foreignKey: "supplierId"
        }
    );
    InChannelConfig.hasOne(
        EInvoiceChannelConfig, {
            targetKey: "supplierId", 
            foreignKey: "supplierId"
        }
    );
    InChannelConfig.hasOne(
        SupplierPortalConfig, {
            targetKey: "supplierId", 
            foreignKey: "supplierId"
        }
    );
    



    return Promise.resolve();
}

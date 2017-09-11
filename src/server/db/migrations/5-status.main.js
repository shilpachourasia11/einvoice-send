'use strict'

const DataTypes = require('sequelize');
const Promise = require('bluebird');

module.exports.up = function(db, config)
{
    const queryInterface = db.getQueryInterface();


    const one = db.queryInterface.addColumn(
        'PdfChannelConfig',
        'status',
        {
            type : DataTypes.STRING(100),
            allowNull : false,
            defaultValue : 'new'
        }
    );

    const two = db.queryInterface.addColumn(
        'PaperChannelConfig',
        'status',
        {
            type : DataTypes.STRING(100),
            allowNull : false,
            defaultValue : 'new'
        }
    );

    const three = db.queryInterface.addColumn(
        'EInvoiceChannelConfig',
        'status',
        {
            type : DataTypes.STRING(100),
            allowNull : false,
            defaultValue : 'new'
        }
    );

    const four = db.queryInterface.addColumn(
        'SupplierPortalConfig',
        'status',
        {
            type : DataTypes.STRING(100),
            allowNull : false,
            defaultValue : 'new'
        }
    );


    // const nine = queryInterface.changeColumn('PdfChannelConfig', 'supplierId', {
    //   type : DataTypes.STRING(30),
    //   allowNull : false,
    //   primaryKey : true,
    //   references : {
    //       model : 'InChannelConfig',
    //       key : 'supplierId'
    //   }
    // });
    const promm = Promise.all([one, two, three, four]).then(() => {
      const five  = queryInterface.sequelize.query('UPDATE `PdfChannelConfig` JOIN `InChannelConfig` on `PdfChannelConfig`.`supplierId` = `InChannelConfig`.`supplierId` SET `PdfChannelConfig`.`status` = `InChannelConfig`.`status`')
      const six   = queryInterface.sequelize.query('UPDATE `einvoice`.`PaperChannelConfig` JOIN `einvoice`.`InChannelConfig` ON `einvoice`.`PaperChannelConfig`.`supplierId` = `einvoice`.`InChannelConfig`.`supplierId` SET `einvoice`.`PaperChannelConfig`.`status` = `einvoice`.`InChannelConfig`.`status`')
      const seven = queryInterface.sequelize.query('UPDATE `einvoice`.`EInvoiceChannelConfig` JOIN `einvoice`.`InChannelConfig` ON `einvoice`.`EInvoiceChannelConfig`.`supplierId` = `einvoice`.`InChannelConfig`.`supplierId` SET `einvoice`.`EInvoiceChannelConfig`.`status` = `einvoice`.`InChannelConfig`.`status`')
      const eight = queryInterface.sequelize.query('UPDATE `einvoice`.`SupplierPortalConfig` JOIN `einvoice`.`InChannelConfig` ON `einvoice`.`SupplierPortalConfig`.`supplierId` = `einvoice`.`InChannelConfig`.`supplierId` SET `einvoice`.`SupplierPortalConfig`.`status` = `einvoice`.`InChannelConfig`.`status`')
      return Promise.all([five,six,seven,eight]);
    }
    );




    // return Promise.all([one, two, three, four]);
    return promm;
}

module.exports.down = function(db, config)
{
    const one = db.queryInterface.dropColumn('PdfChannelConfig', 'status');
    const two = db.queryInterface.dropColumn('PaperChannelConfig', 'status');
    const three = db.queryInterface.dropColumn('EInvoiceChannelConfig', 'status');
    const four = db.queryInterface.dropColumn('SupplierPortalConfig', 'status');

    return Promise.all([one, two, three, four]);
}

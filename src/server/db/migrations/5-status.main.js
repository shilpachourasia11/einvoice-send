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


    return Promise.all([one, two, three, four]).then(() => {
      const all = db.models.InChannelConfig.findAll().map(config => {
        switch (config.inputType) {
          case 'pdf':
            return db.models.PdfChannelConfig.update({ status: config.status}, {
              where: { supplierId: config.supplierId}
            })
            break;
          case 'einvoice':
            return db.models.EInvoiceChannelConfig.update({ status: config.status}, {
              where: { supplierId: config.supplierId}
            })
            break;
          case 'paper':
            return db.models.PaperChannelConfig.update({ status: config.status}, {
              where: { supplierId: config.supplierId}
            })
            break;
          case 'supplierPortal':
            return db.models.SupplierPortalConfig.update({ status: config.status}, {
              where: { supplierId: config.supplierId}
            })
            break;
        }
      });

      return Promise.all(all);
    }
  );
}

module.exports.down = function(db, config)
{
    const one = db.queryInterface.dropColumn('PdfChannelConfig', 'status');
    const two = db.queryInterface.dropColumn('PaperChannelConfig', 'status');
    const three = db.queryInterface.dropColumn('EInvoiceChannelConfig', 'status');
    const four = db.queryInterface.dropColumn('SupplierPortalConfig', 'status');

    return Promise.all([one, two, three, four]);
}

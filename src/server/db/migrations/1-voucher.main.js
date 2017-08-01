'use strict'

const DataTypes = require('sequelize');
const Promise = require('bluebird');

module.exports.up = function(db, config)
{
    return db.queryInterface.addColumn(
        'Voucher',
        'customerSupplierId',
        {
            type : DataTypes.STRING(30),
            allowNull : true
        }
    );
}

module.exports.down = function(db, config)
{
    return db.queryInterface.dropColumn('Voucher', 'customerSupplierId');
}

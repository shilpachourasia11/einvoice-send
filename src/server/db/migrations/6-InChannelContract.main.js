'use strict'
 const DataTypes = require('sequelize');
 module.exports.up = (db,config)=> {
    return db.queryInterface.addColumn(
 		     'InChannelContract',
 		      'supplierCustomerId', {
              type : DataTypes.STRING(30),
              allowNull : true,
 		      }
 	   );
}
 module.exports.down = (db,config)=> {
    return db.queryInterface.dropColumn('InChannelContract', 'supplierCustomerId');
 }
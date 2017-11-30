'use strict'
 const DataTypes = require('sequelize');
 module.exports.up = (db,config)=> {
 	return db.queryInterface.addColumn(
 		'SupplierCustomerId',
 		'intention', {
 			type:DataTypes.BOOLEAN,
 			allowNull:true
 		}
 	);
 }
 module.exports.down = (db,config)=> {
 	return db.queryInterface.dropColumn('SupplierCustomerId', 'SupplierCustomerId');
 }

'use strict'
const DataTypes = require('sequelize');
module.exports.up = function(db,config) {
	return db.queryInterface.addColumn(
		'PdfChannelConfig',
		'rejectionEmail',
		{
			type:DataTypes.STRING(100),
			allowNull:false
		}
	);
}
module.exports.down = function(db,config) {
	return db.queryInterface.dropColumn('PdfChannelConfig','rejectionEmail');
}
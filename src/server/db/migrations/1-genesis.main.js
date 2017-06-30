'use strict'

const DataTypes = require('sequelize');
const Promise = require('bluebird');

module.exports.up = function(db, config)
{
    return db.queryInterface.addColumn('InChannelConfig',
        'voucherId', {
            type: DataTypes.INTEGER,
            allowNull : true
        }
    );
}

module.exports.down = function(db, config)
{
    return db.queryInterface.dropColumn('InChannelConfig', 'voucherId');
}

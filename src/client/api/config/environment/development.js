'use strict';
// Development specific configuration
// ==================================
module.exports = {
  sequelize: {
    uri: 'postgres://postgres:postgres@localhost:5432/workspace',
    options: {
      logging: false,
      dialect: 'postgres',
      define: {
        timestamps: true,
        underscored: true,
         freezeTableName: true,
    }
    }
  },
  // Seed database on startup
 seedDb: false,

};
//uri: 'postgres://postgres:cronj123@192.168.1.223:5432/sms',

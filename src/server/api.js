'use strict'

const Promise = require('bluebird');
const extend = require('extend');

module.exports.init = function(db)
{
    this.db = db;

    return Promise.resolve(this);
}

module.exports.getModelFromInputType = function(inputType)
{
    if(inputType)
    {
        switch(inputType.toLowerCase())
        {
            case 'pdf':
                return this.db.models.PdfChannelConfig;
            case 'einvoice':
                return this.db.models.EInvoiceChannelConfig;
            case 'portal':
                return this.db.models.SupplierPortalConfig;
        }
    }

    throw new Error('Invalid input type. Must be pdf, einvoice or portal.');
}

module.exports.getInChannelConfig = function(supplierId)
{
    // Try finding an existing config...
    return this.db.models.InChannelConfig.findById(supplierId).then(basicConfig =>
    {
        if(basicConfig)
        {
            // Try to load an extended configuration from a different model...
            return this.getModelFromInputType(basicConfig.inputType).findById(supplierId).then(extendedConfig =>
            {
                // Remove fields we do not want to output.
                [ 'supplierId', 'createdBy', 'changedBy', 'createdOn', 'changedOn' ].forEach(key => delete extendedConfig.dataValues[key]);

                // Extend the basic configuration with the extend values.
                basicConfig.dataValues.settings = extendedConfig || { };

                return basicConfig.dataValues;
            })
        }

        throw new Error('The basic configuration for the passed supplier was not found.');
    })
}

module.exports.inChannelConfigExists = function(supplierId)
{
    // Try finding an existing config...
    return this.db.models.InChannelConfig.findById(supplierId).then(basicConfig =>
    {
        if(basicConfig)
        {
            // Find an extended configuration...
            return this.getModelFromInputType(basicConfig.inputType)
            .findById(supplierId).then(config => config && config.supplierId === supplierId);
        }

        return false;
    });
}

module.exports.addInChannelConfig = function(config, returnConfig)
{
    var supplierId = config.supplierId;
    var basicConfig = config;
    var extendedConfig = config.settings || { };

    // Remove nested settings object.
    delete basicConfig.settings;

    // Remove fields we do not want to be set from outside.
    [ 'createdOn', 'changedOn', 'changedBy' ].forEach(key => delete basicConfig[key]);
    // Copy required values to the extendedConfig as it is a plain object.
    [ 'supplierId', 'createdBy' ].forEach(key => extendedConfig[key] = basicConfig[key]);

    // Try to create a new basic config bewfore adding the extended one.
    return this.db.models.InChannelConfig.create(basicConfig).then(() =>
    {
        return this.getModelFromInputType(basicConfig.inputType)
        .create(extendedConfig).then(() => returnConfig ? this.getInChannelConfig(supplierId) : supplierId);
    });
}

module.exports.updateInChannelConfig = function(supplierId, config, returnConfig)
{
    var basicConfig = config;
    var extendedConfig = config.settings || { };

    // Remove nesed settings object.
    delete basicConfig.settings;

    // Remove fields we do not want to be set from outside.
    [ 'type', 'createdOn', 'changedOn', 'createdBy' ].forEach(key => delete basicConfig[key]);
    // Copy required values to the extendedConfig as it is a plain object.
    [ 'changedBy' ].forEach(key => extendedConfig[key] = basicConfig[key]);

    // Override supplierId making sure it's the same on both.
    basicConfig.supplierId = supplierId;
    extendedConfig.supplierId = supplierId;

    basicConfig.changedOn = new Date();
    extendedConfig.changedOn = new Date();

    return this.db.models.InChannelConfig.findById(supplierId).then(existingbasicConfig =>
    {
        if(existingbasicConfig)
        {
            // Set the createdBy field as we do not accept it to be set from outside on updates.
            extendedConfig.createdBy = existingbasicConfig.createdBy;

            return this.db.models.InChannelConfig.update(basicConfig, { where : { supplierId : supplierId } })
            .then(() =>
            {
                return this.getModelFromInputType(existingbasicConfig.inputType).upsert(extendedConfig)
                .then(() => returnConfig ? this.getInChannelConfig(supplierId) : supplierId);
            });
        }

        throw new Error('The basic configuration for the passed supplier was not found.');
    })
}

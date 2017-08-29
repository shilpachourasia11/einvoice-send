'use strict'

const Promise = require('bluebird');
const extend = require('extend');

module.exports.init = function(db)
{
    this.db = db;

    return Promise.resolve(this);
}

/**
 * Provide proper InvoiceChannel sub type:
 * - pdf -> PdfChannelConfig
 * - einvoice -> EInvoiceChannelConfig
 * - portal -> SupplierPortalConfig
 *
 * TODO: What about "paper"? Extra type (schema) or via PDFChannelConfig?
 *
 * @param  {[type]} inputType [description]
 * @return {Object}           The fitting model or an error
 */
module.exports.getModelFromInputType = function(inputType)
{
    if(inputType)
    {
        switch(inputType.toLowerCase())
        {
            case 'pdf':
                return this.db.models.PdfChannelConfig;
            case 'paper':
                return this.db.models.PaperChannelConfig;
            case 'einvoice':
                return this.db.models.EInvoiceChannelConfig;
            case 'portal':
                return this.db.models.SupplierPortalConfig;
        }
    }

    throw new Error('Invalid input type ' + inputType + '. Must be pdf, einvoice, portal or paper.');
}

module.exports.getInChannelConfig = function(supplierId)
{
    // Try finding an existing config...
    return this.db.models.InChannelConfig.findById(supplierId).then(basicConfig =>
    {
        if(basicConfig)
        {
            // Try to load an extended configuration from a different model...
            return this.getModelFromInputType(basicConfig.inputType).findById(supplierId)
            .then(extendedConfig => {

                // Remove fields we do not want to output.
                // [ 'supplierId', 'createdBy', 'changedBy', 'createdOn', 'changedOn' ].forEach(key => delete extendedConfig.dataValues[key]);
                [ 'createdBy', 'changedBy', 'createdOn', 'changedOn' ].forEach(key => delete extendedConfig.dataValues[key]);

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
    return this.db.models.InChannelConfig.findById(supplierId)
    .then(basicConfig =>
    {
        return basicConfig && basicConfig.supplierId === supplierId;

        // TODO: Check whether we really need a test on detailConfiguration here.
/*
console.log(">>>> InChannelConfigExists - basicConfig: ", basicConfig ? basicConfig.dataValues : basicConfig);
        if(basicConfig)
        {
            // Find an extended configuration...
            // return this.getModelFromInputType(basicConfig.inputType)
            //     .findById(supplierId)
            let model = this.getModelFromInputType(basicConfig.inputType);
console.log(">>>> InChannelConfigExists - model: ", model);
            return model.findById(supplierId)
            .then(config => {
console.log(">>>> InChannelConfigExists - " + basicConfig.inputType + ": ", config ? config.dataValues : config);
                return config && config.supplierId === supplierId;
            })
            .catch((err) => {
                console.log("Error - inChannelConfigExists: ", e);
                return
            });
        }
*/
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

    // Try to create a new basic config before adding the extended one.
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
    console.log('=======$$$$$$======',basicConfig);
    // Remove nesed settings object.
    delete basicConfig.settings;

    // Remove fields we do not want to be set from outside.
    [ 'type', 'createdOn', 'changedOn', 'createdBy' ].forEach(key => delete basicConfig[key]);
    // Copy required values to the extendedConfig as it is a plain object.
    [ 'changedBy','rejectionEmail' ].forEach(key => extendedConfig[key] = basicConfig[key]);

    // Override supplierId making sure it's the same on both.
    basicConfig.supplierId = supplierId;
    extendedConfig.supplierId = supplierId;
    basicConfig.changedOn = new Date();
    extendedConfig.changedOn = new Date();

    return this.db.models.InChannelConfig.findById(supplierId).then(existingbasicConfig =>
    {
        if(existingbasicConfig)
        {
            let oldInputType = existingbasicConfig.inputType;
            let newInputType = basicConfig.inputType || oldInputType;

            // Set the createdBy field as we do not accept it to be set from outside on updates.
            extendedConfig.createdBy = existingbasicConfig.createdBy;
            return this.db.models.InChannelConfig.update(basicConfig, { where : { supplierId : supplierId } })
            .then(() => {
                // update of the inputType means
                // if an extendedConfig of the <inputType> exists,
                //   then update it
                // else
                //   1. delete possible old extendedConfig entries (PdfChannelConfig, PaperChannelConfig, ...)
                //   2. create the required one
                //

                let newModel = this.getModelFromInputType(newInputType);
                return newModel.findById(supplierId)
                .then((data) => {
                    if (data) {
                        return data.update(extendedConfig, { where : { supplierId : supplierId } })
                    }
                    else {
                        return newModel.create(extendedConfig)
                        .then((data) => {
                            return this.getModelFromInputType(oldInputType).destroy({ where : { supplierId : supplierId } })
                            .catch((e) => {
                                console.log("updateInChannelConfig - ExtendedConfig could not delete outdated " + newInputType + " Object. Error: ", e);
                                return Promise.resolve();
                            });
                        })
                    }
                })
                .then(() => returnConfig ? this.getInChannelConfig(supplierId) : supplierId)
                .catch((e) => {
                    if (e.name = 'SequelizeValidationError') {
                        return Promise.reject(e);
                    }
                    else {
                        console.log("updateInChannelConfig - Error: ", e);
                        // TODO: Update not possible. Actions neccessary? Create a new one and delete the old entry.
                    }
                })
            });
        }

        throw new Error('The basic configuration for the passed supplier was not found.');
    })
}

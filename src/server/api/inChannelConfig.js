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
    // TODO: Adjust schema for one-2-one dependencies of the sub configs
    //    return this.db.models.InChannelConfig.findById(supplierId, include: [PdfChannelConfig, ...]})

    return this.db.models.InChannelConfig.findById(supplierId)
    .then(basicConfig =>
    {
        if(basicConfig)
        {
            // Workaround without schema change: search for all objects manually
            // 1. einvoice
            // 2. pdf
            // TODO: adjust schema and allow search with include (see above)
            return Promise.all([
                this.db.models.PdfChannelConfig.findById(supplierId),
                this.db.models.EInvoiceChannelConfig.findById(supplierId),
                this.db.models.SupplierPortalConfig.findById(supplierId),
                this.getModelFromInputType(basicConfig.inputType).findById(supplierId)  // TODO: kept the attic approach to keep the interface structure - to be cleansed!
            ])
            .spread((pdfConfig, einvoiceConfig, supplierConfig, extendedConfig) => {
                if (pdfConfig) {
                    basicConfig.dataValues.PdfChannelConfig = pdfConfig;
                }
                if (einvoiceConfig) {
                    basicConfig.dataValues.EInvoiceChannelConfig = einvoiceConfig;
                }
                if (supplierConfig){
                  basicConfig.dataValues.SupplierPortalConfig = supplierConfig;
                }

                // TODO: kept the attic approach to keep the interface structure - to be cleansed!
                [ 'createdBy', 'changedBy', 'createdOn', 'changedOn' ].forEach(key => delete extendedConfig.dataValues[key]);
                basicConfig.dataValues.settings = extendedConfig || { };

                return basicConfig.dataValues;
            })
            .catch((e) => {
                console.log("Error - getInChannelConfig: ", e);
            });
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

    // TODO: As long as eInvoice is only an intention, we are not allowed to store the inputType for "einvoice"
    if (basicConfig.inputType == 'einvoice') {
        delete basicConfig.intputType;
        delete basicConfig.status;
    }

    // TODO: As long as Portal is only an intention, we are not allowed to store the inputType for "portal" #copy of einvoice#
    if (basicConfig.inputType == 'portal') {
        delete basicConfig.intputType;
        delete basicConfig.status;
    }

    // Remove fields we do not want to be set from outside.
    [ 'createdOn', 'changedOn', 'changedBy' ].forEach(key => delete basicConfig[key]);
    // Copy required values to the extendedConfig as it is a plain object.
    [ 'supplierId', 'createdBy', 'rejectionEmail', 'intention', 'status' ].forEach(key => extendedConfig[key] = basicConfig[key]);

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
    // Remove nesed settings object.
    delete basicConfig.settings;

    // Remove fields we do not want to be set from outside.
    [ 'type', 'createdOn', 'changedOn', 'createdBy' ].forEach(key => delete basicConfig[key]);
    // Copy required values to the extendedConfig as it is a plain object.
    [ 'changedBy', 'rejectionEmail', 'intention', 'status' ].forEach(key => {if(basicConfig.hasOwnProperty(key)){extendedConfig[key] = basicConfig[key]}});

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

            // TODO: As long as eInvoice is only an intention, we are not allowed to store the inputType for "einvoice"
            if (newInputType == 'einvoice') {
                basicConfig.inputType = oldInputType;
                basicConfig.status = existingbasicConfig.status;
            }

            // TODO: As long as Portal is only an intention, we are not allowed to store the inputType for "portal" #copy of einvoice#
            if (newInputType == 'portal') {
                basicConfig.inputType = oldInputType;
                basicConfig.status = existingbasicConfig.status;
            }

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

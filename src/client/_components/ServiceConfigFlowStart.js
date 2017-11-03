import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import { Button, Radio } from 'react-bootstrap';
import { Redirect } from 'react-router';
import ajax from 'superagent-bluebird-promise';
import Promise from 'bluebird';

import BillingDetails from './common/BillingDetails'

import InChannelConfig from '../api/InChannelConfig.js';



// A workaround to prevent a browser warning about unknown properties 'active', 'activeKey' and 'activeHref'
// in DIV element.
const MyDiv = () =>
{
    return <div className="connecting-line"/>;
};

export default class ServiceConfigFlowStart extends Components.ContextComponent
{
    static propTypes = {
        invoiceSendingType : React.PropTypes.string,
        preValidationSuccess : React.PropTypes.bool,
        inChannelConfig: React.PropTypes.object
    };

    static defaultProps = {
        invoiceSendingType : null,
        preValidationSuccess : false
    };

    constructor(props)
    {
        super(props);

        this.state = {
            invoiceSendingType : this.props.invoiceSendingType,
            preValidationSuccess : this.props.preValidationSuccess
        };
    }

    /////////////////////////////////////////////
    // Lifecycle methods
    /////////////////////////////////////////////

    componentWillMount() {
        this.preValidation();
    }

    // TODO: Any type dependent prevalidation needed?
    preValidation = () => {
        // Should be done based on customer definitions, but so far we do not have a structure for this purpose.

        // Check on existance of Supplier.VatIdentificationNo or SupplierBankAccount.AccountNumber
        return ajax.get('/supplier/api/suppliers/' + this.props.user.supplierId + "?include=bankAccounts")
        .then((supplier) => {
            let bankAccounts = supplier.body.bankAccounts;
            let aBankAccount = bankAccounts && bankAccounts[0] && bankAccounts[0].accountNumber;
            let vatId = supplier.body.vatIdentificationNo;

            this.setState({"preValidationSuccess" : !!vatId || !!aBankAccount});
            this.setState({"preValidationSuccess" : true});
        })

    }


    /////////////////////////////////////////////
    // Events
    /////////////////////////////////////////////

    onInvoiceSendingTypeChanged = (event) => {
        this.setState({invoiceSendingType : event.target.value});
    }

    // Selection of pdf, einvoice, portal or paper
    setInputType = function() {
        let supplierId = this.props.voucher.supplierId;

        let icc = this.props.inChannelConfig;

        // Don't take status from other types (that were configured before)
        // TODO: Potentially loses previously added info for this type. Has to be fixed with Status on ExtendedConfig entry!
        let oldStatus = (icc && icc.inputType == this.state.invoiceSendingType) ? icc.status : InChannelConfig.status.new;
        let obj = {
            inputType: this.state.invoiceSendingType,
            voucherId: this.props.voucher.id,
            status: InChannelConfig.getNextStatus(oldStatus, InChannelConfig.status.new),
            billingModelId: this.state.invoiceSendingType == 'einvoice' ? 'external' : null
        };

        return new Promise((resolve, reject) => {
            // TODO: Check that it works for pdf and einvoice!!!
            return InChannelConfig.update(supplierId, obj)
            .then(() => {
                resolve();
            })
            .catch((e) => {
                return InChannelConfig.add(supplierId, obj)
                .then(() => {
                    resolve();
                })
                .catch((e) => {
                })
            })
        })
        .then(() => {
            return this.props.openFlow(this.state.invoiceSendingType);
        })
        .catch((e) => {
            alert("Saving the service type did not succeed. Please retry.");
        });
    }



    /////////////////////////////////////////////
    // Rendering
    /////////////////////////////////////////////

    renderStandardHello = (customerName) => {
        if (this.state.preValidationSuccess && this.props.voucher.customerId) {
            let hello = this.context.i18n.getMessage('ServiceConfigFlowStart.hello', { customerName: this.props.voucher.customerName});
            let intro1 = this.context.i18n.getMessage('ServiceConfigFlowStart.intro1', { customerName: this.props.voucher.customerName});
            let intro2 = this.context.i18n.getMessage('ServiceConfigFlowStart.intro2');

            return (
                <div className="bs-callout bs-callout-info">
                    <h4>{hello}</h4>
                    <p>
                        {intro1}
                        <br/>
                        {intro2}
                    </p>
                </div>
            );
        }
    }

    renderVoucherMissing = () => {
        if (this.state.preValidationSuccess && !this.props.voucher.customerId) {
            let hello = this.context.i18n.getMessage('ServiceConfigFlowStart.helloWithoutCustomer');
            let intro1 = this.context.i18n.getMessage('ServiceConfigFlowStart.intro1WithoutCustomer');
            return (
                <div className="bs-callout bs-callout-warning">
                    <h4>{hello}</h4>
                    <p>
                        {intro1}
                        <Button bsStyle="link" onClick={() => this.props.loadVoucher()}>
                            {this.context.i18n.getMessage('ServiceConfigFlowStart.reloadVoucher')}
                        </Button>
                    </p>
                </div>
            );
        }
    }

    renderValidationError = () => {
        if (!this.state.preValidationSuccess) {
            let hello = this.context.i18n.getMessage('ServiceConfigFlowStart.helloWithoutValidationSuccess', { customerName: this.props.voucher.customerName});
            let intro1 = this.context.i18n.getMessage('ServiceConfigFlowStart.intro1WithoutValidatinoSuccess', { customerName: this.props.voucher.customerName});
            let supplierProfile = this.context.i18n.getMessage('ServiceConfigFlowStart.supplierProfile');
            return (
                <div className="bs-callout bs-callout-danger">
                    <h4>{hello}</h4>
                    <p>
                        {intro1}
                        <Button bsStyle="link" onClick={() => window.location.replace("/bnp/supplierInformation?backUrl=/einvoice-send")}>
                            {supplierProfile}
                        </Button>
                    </p>
                </div>
            );
        }
    }

    getConfigurationState = (type) => {

        let objNameMapping = {
            einvoice: "EInvoiceChannelConfig",
            pdf: "PdfChannelConfig",
            keyIn: "SupplierPortalConfig", // TODO: move schema to "KeyInConfig",
            paper: "PaperChannelConfig"
        }
        let objName = objNameMapping[type];
        let xConfig = this.props.inChannelConfig && this.props.inChannelConfig[objName];
        let status = this.props.inChannelConfig && this.props.inChannelConfig.status;
        if (xConfig) {
            if (this.props.inChannelConfig.inputType === type) {
                return status;
            }
            else {
                // TODO: How to mark it? Configuration is done, but another type is active!
                // return "notActivated";
            }
        }
        else {
            return "undefined";
        }
    }

    renderState(type) {
        let state = this.getConfigurationState(type);
        if (state && state != "undefined") {
            let color = (state == 'activated' || state == 'configured') ? "green" : "red";
            return (
                <div style={{ paddingTop: '10px', color:color}}>
                    {this.context.i18n.getMessage('ServiceConfigFlowStart.statuses.' + state)}
                </div>
            )
        }
    }

    render()
    {
        return (
            <div>
                <h3>{this.context.i18n.getMessage('ServiceConfigFlowStart.header')}</h3>

                {this.renderStandardHello()}
                {this.renderValidationError()}
                {this.renderVoucherMissing()}

                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio
                                disabled={!this.props.voucher.eInvoiceEnabled}
                                onChange={ this.onInvoiceSendingTypeChanged }
                                checked={ this.state.invoiceSendingType === 'einvoice' }
                                value="einvoice"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.props.voucher.eInvoiceEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    {this.context.i18n.getMessage('ServiceConfigFlowStart.eInvoice')}
                                    <BillingDetails inputType="eInvoice" voucher={this.props.voucher} />
                                </h4>
                                {this.renderState("einvoice") || <br/>}
                            </div>
                            <div className="panel-body">
                                {this.context.i18n.getMessage('ServiceConfigFlowStart.eInvoiceDesc')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio
                                disabled={!this.props.voucher.pdfEnabled}
                                onChange={ this.onInvoiceSendingTypeChanged }
                                checked={ this.state.invoiceSendingType === 'pdf' }
                                value="pdf"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.props.voucher.pdfEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">{this.context.i18n.getMessage('ServiceConfigFlowStart.pdf')}
                                    <BillingDetails inputType="pdf" voucher={this.props.voucher} />
                                </h4>
                                {this.renderState("pdf")}
                            </div>
                            <div className="panel-body">
                                {this.context.i18n.getMessage('ServiceConfigFlowStart.pdfDesc')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio
                                disabled={!this.props.voucher.keyInEnabled}
                                onChange={ this.onInvoiceSendingTypeChanged }
                                checked={ this.state.invoiceSendingType === InChannelConfig.types.keyIn }
                                value={InChannelConfig.types.keyIn}/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.props.voucher.keyInEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">{this.context.i18n.getMessage('ServiceConfigFlowStart.keyIn')}
                                    <BillingDetails inputType={InChannelConfig.types.keyIn} voucher={this.props.voucher} />
                                </h4>
                                {this.renderState(InChannelConfig.types.keyIn)}
                            </div>
                            <div className="panel-body">
                                {this.context.i18n.getMessage('ServiceConfigFlowStart.keyInDesc')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio
                                disabled={!this.props.voucher.paperEnabled}
                                onChange={ this.onInvoiceSendingTypeChanged }
                                checked={this.state.invoiceSendingType === 'paper' }
                                value="paper"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.props.voucher.paperEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">{this.context.i18n.getMessage('ServiceConfigFlowStart.paper')}
                                    <BillingDetails inputType="paper" voucher={this.props.voucher} />
                                </h4>
                                {this.renderState("paper")}
                            </div>
                            <div className="panel-body">
                                {this.context.i18n.getMessage('ServiceConfigFlowStart.paperDesc')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-submit text-right">
                    <Button bsStyle="primary" disabled={ !this.state.invoiceSendingType || !this.state.preValidationSuccess }
                        onClick={ () =>  this.setInputType() }>
                        {this.context.i18n.getMessage('saveAndContinue')}
                    </Button>
                </div>
            </div>
        )
    }
}

import React from 'react';
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

export default class InChannelConfigStart extends React.Component
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
            user : {},
            voucher : {},
            billingDetails : {},
            customer : {
                customerId : "",
                customerName : ""
            },
            inChannelConfig : {},
            invoiceSendingType : this.props.invoiceSendingType,
            preValidationSuccess : this.props.preValidationSuccess
        };
    }

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };


    componentDidMount()
    {
console.log("InChannelConfigStart - componentDidMount is called");
        return this.getUserData().then(userData =>
        {
            console.log("ICC 1. User: ", userData);
            if (userData.supplierid) { userData.supplierId = userData.supplierid; }
            this.setState({ user : userData });
            return this.getVoucher(userData.supplierid);
        })
        .then(voucher =>
        {
            console.log("ICC 2. Voucher: ", voucher);
            this.setState({ voucher : voucher });
            return this.getBillingDetails(voucher.supplierId);
        })
        .then(billingDetails =>
        {
            console.log("ICC 3. BillingDetails: ", billingDetails);
            this.setState({ billingDetails : billingDetails });
            return this.getCustomer(this.state.voucher.customerId);
        })
        .then(customer =>
        {
            console.log("ICC 4. Customer: ", customer);
            customer.id = this.state.voucher.customerId;    // ????
            if (!customer.customerName) customer.customerName = customer.customerId;
            this.setState({ customer : customer });
            return Promise.resolve(); // ???
        })
        .then(() => {
            return this.preValidation();
        })
        .then(() => {
            return this.getInChannelConfig(this.state.voucher.supplierId);
        })
        .then((config) => {
            console.log("ICC 5. InChannelConfig: ", config);
            return this.setState({inChannelConfig: config});
        })
        .catch((e) =>  {
            console.log("Error determined when collecting data: ", e);
            // return new Promise.resolve();
        });
    }


    getUserData()
    {
        return ajax.get('/auth/userdata').then(res => JSON.parse(res.text));
    }

    getVoucher(supplierId)
    {
        return ajax.get('/einvoice-send/api/config/vouchers/' + supplierId)
            .set('Content-Type', 'application/json')
            .promise()
        .then(res => JSON.parse(res.text));
    }

    getBillingDetails(supplierId) {
        // How will evaluation of allowed input types and billings be determined???
        // Convention for now: Use boolen to enable or disable the different input types:
        return {
            eInvoiceEnabled : true,
            pdfEnabled : true,
            supplierPortalEnabled : false,
            paperEnabled : false
        }
    }

    getCustomer = (customerId) => {
        return ajax.get('/einvoice-send/api/customers/' + customerId)
        .then((result) => {
            return JSON.parse(result.text);
        })
        .catch((e) =>  {
            console.log("Error - Did not receive details about customer with Id: " + customerId + " - error: ", e);
            return new Promise.resolve();
        });
    }

    getInChannelConfig(supplierId) {
console.log("------------ Searching InChannelConfig with supplier: ", supplierId);
        return ajax.get('/einvoice-send/api/config/inchannels/' + supplierId)
            .set('Content-Type', 'application/json')
        .then(res => {
console.log("------------ InChannelConfig: ", res);
            return res.body;
        })
        .catch((e) => {
            console.log("Error determined when fetching InChannelConfig for supplier " + this.state.user.supplierId + ": ", e);
        });
    }



    /////////////////////////////////////////////
    // Lifecycle methods
    /////////////////////////////////////////////

    componentWillMount() {
//        this.preValidation();  // ...DidMount() ????
    }



// ???
//    componentWillReceiveProps() {
//    }

    preValidation = () => {
        // Should be done based on customer definitions, but so far we do not have a structure for this purpose.

        // Check on existance of Supplier.VatIdentificationNo or SupplierBankAccount.AccountNumber
        return ajax.get('/supplier/api/suppliers/' + this.state.user.supplierId + "?include=bankAccounts")
            .set('Content-Type', 'application/json')
            .promise()
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

        console.log("??????  openFlow()", this.state.invoiceSendingType);
        this.props.openFlow(this.state.invoiceSendingType);

/*
        let supplierId = this.state.voucher.supplierId;
        let obj = {
            inputType: this.state.invoiceSendingType,
            voucherId: this.state.voucher.id,
            status: InChannelConfig.getNextStatus(this.state.inChannelConfig && this.state.inChannelConfig.status, InChannelConfig.status.new)
        };

        return new Promise((resolve, reject) => {
            return InChannelConfig.update(supplierId, obj)
            .then(() => {
                resolve();
            })
            .catch((e) => {
                return InChannelConfig.add(supplierId, obj)
                .then(() => {
                    console.log("InChannelConfig did not exist and was successfully created.");
                    resolve();
                })
            })
        })
        .then(() => {
            console.log("??????  openFlow()", this.state.invoiceSendingType);
            this.props.openFlow(this.state.invoiceSendingType);
        })
        .catch((e) => {
            console.log("Error: ", e);
            alert("Saving the service type did not succeed. Please retry.");
        });
*/
    }



    /////////////////////////////////////////////
    // Rendering
    /////////////////////////////////////////////

    renderStandardHello = (customerName) => {
        if (this.state.preValidationSuccess && this.state.voucher.customerId) {
            let hello = this.context.i18n.getMessage('ServiceConfigFlowStart.hello', { customerName: this.state.customer.customerName});
            let intro1 = this.context.i18n.getMessage('ServiceConfigFlowStart.intro1', { customerName: this.state.customer.customerName});
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
        if (this.state.preValidationSuccess && !this.state.voucher.customerId) {
            let hello = this.context.i18n.getMessage('ServiceConfigFlowStart.helloWithoutCustomer');
            let intro1 = this.context.i18n.getMessage('ServiceConfigFlowStart.intro1WithoutCustomer');
            return (
                <div className="bs-callout bs-callout-warning">
                    <h4>{hello}</h4>
                    <p>
                        {intro1}
                        <Button bsStyle="link" onClick={() => {/*this.props.loadVoucher() ???? */} }>
                            {this.context.i18n.getMessage('ServiceConfigFlowStart.reloadVoucher')}
                        </Button>
                    </p>
                </div>
            );
        }
    }

    renderValidationError = () => {
        if (!this.state.preValidationSuccess) {
            let hello = this.context.i18n.getMessage('ServiceConfigFlowStart.helloWithoutValidationSuccess', { customerName: this.state.customer.customerName});
            let intro1 = this.context.i18n.getMessage('ServiceConfigFlowStart.intro1WithoutValidatinoSuccess', { customerName: this.state.customer.customerName});
            let supplierProfile = this.context.i18n.getMessage('ServiceConfigFlowStart.supplierProfile');

            // data not loaded successfully   ??????
            if (this.statebillingDetails == {}) {
                let hello = "Loading data...";
                let intro1 = "111111";
                let supplierProfile = "2222222";
            }

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
        let icc = this.state.inChannelConfig;
        if (icc) {
            let objNameMapping = {
                einvoice: "EInvoiceChannelConfig",
                pdf: "PdfChannelConfig",
                supplier: "SupplierPortalConfig",
                paper: "PaperChannelConfig"
            }
            let objName = objNameMapping[type];
            let xConfig = icc[objName];             // TODO: Clarify how to get status von xConfig in future!
            let status = xConfig && xConfig.status;

            if (icc.inputType === type) {
                return status;
            }
            else {
                // TODO: How to mark it? Configuration is done, but another type is active!
                return "notActivated";
            }
        }
        else {
            return "undefined";
        }
    }

    renderState(type) {
        let state = this.getConfigurationState(type);
        if (state && state != "undefined" && state != "notActivated") {
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
                                disabled={!this.state.billingDetails.eInvoiceEnabled}
                                onChange={ this.onInvoiceSendingTypeChanged }
                                checked={ this.state.invoiceSendingType === 'einvoice' }
                                value="einvoice"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.state.billingDetails.eInvoiceEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">
                                    {this.context.i18n.getMessage('ServiceConfigFlowStart.eInvoice')}
                                    <BillingDetails inputType="eInvoice" voucher={this.state.voucher} />
                                </h4>
                                {this.renderState("einvoice")}
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
                                disabled={!this.state.billingDetails.pdfEnabled}
                                onChange={ this.onInvoiceSendingTypeChanged }
                                checked={ this.state.invoiceSendingType === 'pdf' }
                                value="pdf"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.state.billingDetails.pdfEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">{this.context.i18n.getMessage('ServiceConfigFlowStart.pdf')}
                                    <BillingDetails inputType="pdf" voucher={this.state.voucher} />
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
                                disabled={!this.state.billingDetails.supplierPortalEnabled}
                                onChange={ this.onInvoiceSendingTypeChanged }
                                checked={ this.state.invoiceSendingType === 'supplier' }
                                value="supplier"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.state.billingDetails.supplierPortalEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">{this.context.i18n.getMessage('ServiceConfigFlowStart.supplierPortal')}
                                    <BillingDetails inputType="supplierPortal" voucher={this.state.voucher} />
                                </h4>
                                {this.renderState("supplier")}
                            </div>
                            <div className="panel-body">
                                {this.context.i18n.getMessage('ServiceConfigFlowStart.supplierPortalDesc')}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio
                                disabled={!this.state.billingDetails.paperEnabled}
                                onChange={ this.onInvoiceSendingTypeChanged }
                                checked={this.state.invoiceSendingType === 'paper' }
                                value="paper"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.state.billingDetails.paperEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">{this.context.i18n.getMessage('ServiceConfigFlowStart.paper')}
                                    <BillingDetails inputType="paper" voucher={this.state.voucher} />
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

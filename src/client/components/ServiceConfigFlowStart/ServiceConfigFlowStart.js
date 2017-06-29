import React from 'react';
import { Button, Radio } from 'react-bootstrap';
import { Redirect } from 'react-router';
import ajax from 'superagent-bluebird-promise';
import Promise from 'bluebird';

import BillingDetails from '../common/BillingDetails'


// A workaround to prevent a browser warning about unknown properties 'active', 'activeKey' and 'activeHref'
// in DIV element.
const MyDiv = () =>
{
    return <div className="connecting-line"/>;
};

export default class ServiceConfigFlowStart extends React.Component
{
    static propTypes = {
        invoiceSendingType : React.PropTypes.string
    };

    static defaultProps = {
        invoiceSendingType : null
    };

    constructor(props)
    {
        super(props);
        this.state = {
            invoiceSendingType : this.props.invoiceSendingType
        };
    }

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };



    /////////////////////////////////////////////
    // Events
    /////////////////////////////////////////////

    onInvoiceSendingTypeChanged = (event) => {
        this.setState({invoiceSendingType : event.target.value});
    }

    updateInChannelConfig = (values) => {
        return ajax.put('/einvoice-send/api/config/inchannel')  // !!! /current
            .set('Content-Type', 'application/json')
            .send(values)
            .promise();
    }

    createInChannelConfig = (values) => {
        return ajax.post('/einvoice-send/api/config/inchannel')
            .set('Content-Type', 'application/json')
            .send(values)
            .promise();
    }


    // pdf, einvoice, portal or paper
    setInputType = function() {

        var data = {
            inputType: this.state.invoiceSendingType,
            status: 'new'
        };

        return new Promise((resolve, reject) => {
            return this.updateInChannelConfig(data)
            .then(() => {
                resolve();
            })
            .catch((e) => {
console.log("+ setInputType - Error: ", e);
                return this.createInChannelConfig(data)
                .then(() => {
                    console.log("InChannelConfig did not exist and was successfully created.");
                    resolve();
                })
            })
        })
        .then(() => {
            this.props.openFlow(this.state.invoiceSendingType);
        })
        .catch((e) => {
            console.log("Error: ", e);
            alert("Saving the service type did not succeed. Please retry.");
        });
    }


    render()
    {
        // TODO: Replace with translations - maybe move the Hello area to an own component. ???
        let hello;
        let intro1;
        let intro2;
        if (this.props.voucher.customerId) {
            hello = this.context.i18n.getMessage('ServiceConfigFlowStart.hello', { customer: this.props.voucher.customerId});
            intro1 = this.context.i18n.getMessage('ServiceConfigFlowStart.intro1', { customer: this.props.voucher.customerId});
            intro2 = this.context.i18n.getMessage('ServiceConfigFlowStart.intro2');
        }
        else {
            hello = this.context.i18n.getMessage('ServiceConfigFlowStart.helloWithoutCustomer');
            intro1 = this.context.i18n.getMessage('ServiceConfigFlowStart.intro1WithoutCustomer');
        }

console.log("**** Voucher: ", this.props.voucher);

        return (
            <div>
                <h3>{this.context.i18n.getMessage('ServiceConfigFlowStart.header')}</h3>

                <div className="bs-callout bs-callout-info">
                    <h4>{hello}</h4>
                    <p>
                        {intro1}
                        <br/>
                        {intro2}
                    </p>
                </div>
                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio disabled={!this.props.voucher.eInvoiceEnabled} onChange={ this.onInvoiceSendingTypeChanged } checked={ this.state.invoiceSendingType === 'einvoice' } value="einvoice"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.props.voucher.eInvoiceEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">{this.context.i18n.getMessage('ServiceConfigFlowStart.eInvoice')}
                                    <BillingDetails inputType="eInvoice" voucher={this.props.voucher} />
                                </h4>
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
                            <Radio disabled={!this.props.voucher.pdfEnabled} onChange={ this.onInvoiceSendingTypeChanged } checked={ this.state.invoiceSendingType === 'pdf' } value="pdf"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.props.voucher.pdfEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">{this.context.i18n.getMessage('ServiceConfigFlowStart.pdf')}
                                    <BillingDetails inputType="pdf" voucher={this.props.voucher} />
                                </h4>
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
                            <Radio  disabled={!this.props.voucher.supplierPortalEnabled} onChange={ this.onInvoiceSendingTypeChanged } checked={ this.state.invoiceSendingType === 'supplier' } value="supplier"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.props.voucher.supplierPortalEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">{this.context.i18n.getMessage('ServiceConfigFlowStart.supplierPortal')}
                                    <BillingDetails inputType="supplierPortal" voucher={this.props.voucher} />
                                </h4>
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
                            <Radio  disabled={!this.props.voucher.paperEnabled} onChange={ this.onInvoiceSendingTypeChanged } checked={this.state.invoiceSendingType === 'paper' } value="paper"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className={"panel panel-default " + (this.props.voucher.paperEnabled ? "" : "disabled")}>
                            <div className="panel-heading">
                                <h4 className="panel-title">{this.context.i18n.getMessage('ServiceConfigFlowStart.paper')}
                                    <BillingDetails inputType="paper" voucher={this.props.voucher} />
                                </h4>
                            </div>
                            <div className="panel-body">
                                {this.context.i18n.getMessage('ServiceConfigFlowStart.paperDesc')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-submit text-right">
                    {/*<Button bsStyle="link" onClick={ () => this.props.onPrevious() }>Cancel</Button>   ??? Where to go? */}
                    <Button bsStyle="primary" disabled={ !this.state.invoiceSendingType }
                        onClick={ () =>  this.setInputType() }>
                        Save &amp; Continue
                    </Button>
                </div>
            </div>
        )
    }
}

import React from 'react';
import { Button, Radio } from 'react-bootstrap';
import { Redirect } from 'react-router';
import ajax from 'superagent-bluebird-promise';
import Promise from 'bluebird';

// A workaround to prevent a browser warning about unknown properties 'active', 'activeKey' and 'activeHref'
// in DIV element.
const MyDiv = () =>
{
    return <div className="connecting-line"/>;
};

export default class ServiceConfigFlowStart extends React.Component
{
    static propTypes = {
        invoiceSendingType : React.PropTypes.string,
        invitationCode : React.PropTypes.string
    };

    static defaultProps = {
        invoiceSendingType : null,
        invitationCode : ''      /* ??? We need the invitation code to determine the customer. -> Voucher???*/
    };

    constructor(props)
    {
        super(props);
        this.state = {
            invoiceSendingType : this.props.invoiceSendingType,
            invitationCode : this.props.invitationCode
        };
    }

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
            alert("Saving the service type did not succeed. Please retry.");
        });
    }


    render()
    {
        var styleFree = {
            float:"right",
            color:"#5ab95a",
            fontWeight:"bold"
        };

        return (
            <div>
                <h3>Type of Service</h3>

                <div className="bs-callout bs-callout-info">
                    <h4>Please select one type here:</h4>
                    <p>
                        This is the onboarding site for <b>NCC Svenska AB.</b>
                        <br/>
                        You have received information about <b>Self Service Onboarding</b> on behalf of NCC. Please register your account and chose your choice of invoice sending. Further instructions will follow.
                    </p>
                </div>
                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio disabled onChange={ this.onInvoiceSendingTypeChanged } checked={ this.state.invoiceSendingType === 'einvoice' } value="einvoice"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className="panel panel-default disabled">
                            <div className="panel-heading">
                                <h4 className="panel-title">eInvoice</h4>
                            </div>
                            <div className="panel-body">
                                Connect with your existing service provider for e-invoicing by simply choose your operator from our partner list and we set up your connection in no time.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio onChange={ this.onInvoiceSendingTypeChanged } checked={ this.state.invoiceSendingType === 'pdf' } value="pdf"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">PDF by E-Mail <span style={styleFree}>FREE</span></h4>
                            </div>
                            <div className="panel-body">
                                By sending your invoice as PDF attached to an email you can easily submit your invoice. Continue registration and Read more under option PDF by e-mail in order to proceed.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio disabled onChange={ this.onInvoiceSendingTypeChanged } checked={ this.state.invoiceSendingType === 'supplier' } value="supplier"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className="panel panel-default disabled">
                            <div className="panel-heading">
                                <h4 className="panel-title">Supplier Portal</h4>
                            </div>
                            <div className="panel-body">
                                By manual key in your invoice data you can easily submit your invoice in the correct format. Continue registration and Read more under option Supplier Portal in order to proceed.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio onChange={ this.onInvoiceSendingTypeChanged } checked={this.state.invoiceSendingType === 'paper' } value="paper"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className="panel panel-default">
                            <div className="panel-heading">
                                <h4 className="panel-title">Paper-Invoice<span style={styleFree}>FREE</span></h4>
                            </div>
                            <div className="panel-body">
                                Until the year end of 2018 NCC still receives paper invoices. Continue registration and Read more under option Paper-Invoice in order to proceed.
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

import React from 'react';
import { Button, FormControl, Radio } from 'react-bootstrap';

export default class ServiceConfigFlow1 extends React.Component
{
    static propTypes = {
        invoiceSendingType : React.PropTypes.string,
        invitationCode : React.PropTypes.string,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired
    };

    static defaultProps = {
        invoiceSendingType : null,
        invitationCode : ''
    };

    constructor(props)
    {
        super(props);

        this.state = {
            invoiceSendingType : this.props.invoiceSendingType,
            invitationCode : this.props.invitationCode
        };
    }

    onInvoiceSendingTypeChanged = (event) => this.setState({invoiceSendingType : event.target.value});

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
                            <Radio disabled onChange={ this.onInvoiceSendingTypeChanged } checked={ this.state.invoiceSendingType === 'eInvoice' } value="eInvoice"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className="panel panel-default">
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
                            <Radio onChange={ this.onInvoiceSendingTypeChanged } checked={ this.state.invoiceSendingType === 'pdfByEmail' } value="pdfByEmail"/>
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
                            <Radio disabled onChange={ this.onInvoiceSendingTypeChanged } checked={ this.state.invoiceSendingType === 'supplierPortal' } value="supplierPortal"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <div className="panel panel-default">
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
                            <Radio onChange={ this.onInvoiceSendingTypeChanged } checked={this.state.invoiceSendingType === 'paperInvoice' } value="paperInvoice"/>
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
                    <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>Cancel</Button>
                    <Button bsStyle="primary" disabled={ !this.state.invoiceSendingType } onClick={ () => this.props.onNext() }>
                        Save &amp; Continue
                    </Button>
                </div>
            </div>
        )
    }
}

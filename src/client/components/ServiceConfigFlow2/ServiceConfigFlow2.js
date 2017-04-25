import React from 'react';
import { Button, FormControl, Radio } from 'react-bootstrap';

export default class ServiceConfigFlow2 extends React.Component
{
    static propTypes = {
        ediAddress : React.PropTypes.string,
        communicationType : React.PropTypes.string,
        communicationProtocol : React.PropTypes.string,
        messageType : React.PropTypes.string,
        contactName : React.PropTypes.string,
        contactPhone : React.PropTypes.string,
        contactEmail : React.PropTypes.string,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired
    };

    static defaultProps = {
        ediAddress : '',
        communicationType : null,
        communicationProtocol : null,
        messageType : null,
        contactName : '',
        contactPhone : '',
        contactEmail : ''
    };

    constructor(props)
    {
        super(props);

        this.state = {
            ediAddress : this.props.ediAddress,
            communicationType : this.props.communicationType,
            communicationProtocol : this.props.communicationProtocol,
            messageType : this.props.messageType,
            contactName : this.props.contactName,
            contactPhone : this.props.contactName,
            contactEmail : this.props.contactName
        }
    }

    onCommunicationTypeChanged = (event) => this.setState({ communicationType : event.target.value });
    onEdiAddressChanged = (event) => this.setState({ ediAddress : event.target.value });
    onMessageTypeChanged = (event) => this.setState({ messageType : event.target.value });
    onContactNameChanged = (event) => this.setState({ contactName : event.target.value });
    onContactPhoneChanged = (event) => this.setState({ contactPhone : event.target.value });
    onContactEmailChanged = (event) => this.setState({ contactEmail: event.target.value });
    onCommunicationProtocolChanged = (event) => this.setState({ communicationProtocol: event.target.value });

    render() {
        return (
            <div>
                <h3>eInvoice Setup</h3>
                <div className="bs-callout bs-callout-info">
                    <h4 id="callout-progress-csp">Configure eInvoice for the Business Network Portal</h4>
                    <p>
                        There are some information needed in order to enable your company within the Business Network Portal to start sending eInvoices. Fill in required information in order to setup and test your eInvoice connectivity.
                    </p>
                </div><hr/>
                <h4>Format and EDI Address</h4>
                <form className="form-horizontal">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="col-sm-3 control-label">Message Type</label>
                                <div className="col-sm-9">
                                    <FormControl componentClass="select" onChange={ this.onMessageTypeChanged }>
                                        <option value="insert-update" checked={ this.props.messageType === 'SVEFAKTURA' }>SVEFAKTURA</option>
                                        <option value="replace" checked={ this.props.messageType === 'replace' }>replace</option>
                                    </FormControl>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="col-sm-3 control-label">EDI Address</label>
                                <div className="col-sm-9">
                                    <FormControl type="text" value={ this.state.contactPhone } placeholder="556677-1122" onChange={ this.onEdiAddressChanged }/>
                                </div>
                            </div>
                        </div>
                    </div>
                </form><hr/>
                <h4>Communication</h4>
                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio onChange={ this.onCommunicationTypeChanged } checked={ this.state.communicationType === 'VAN' } value="VAN"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <form className="form-horizontal">
                            <div className="row">
                                <div className="form-group">
                                    <label className="col-sm-1 control-label">VAN</label>
                                    <div className="col-sm-3">
                                        <FormControl componentClass="select">
                                            <option value="Baseware">Baseware</option>
                                            <option value="replace">replace</option>
                                        </FormControl>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="oc-check">
                                            <input type="checkbox" value="1" checked={ this.state.communicationProtocol === '1' } onChange={ this.onCommunicationProtocolChanged } />
                                            GXS TRADING GRID
                                        </label>
                                        <br/>
                                        <label className="oc-check">
                                            <input type="checkbox" value="2" checked={ this.state.communicationProtocol === '2' } onChange={ this.onCommunicationProtocolChanged } />
                                            VAN
                                        </label>
                                        <br/>
                                        <label className="oc-check">
                                            <input type="checkbox" value="3" checked={ this.state.communicationProtocol === '3' } onChange={ this.onCommunicationProtocolChanged } />
                                            Dinet
                                        </label>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="oc-check">
                                            <input type="checkbox" value="4" checked={ this.state.communicationProtocol === '4' } onChange={ this.onCommunicationProtocolChanged } />
                                            BT Infonet (VAN)
                                        </label>
                                        <br/>
                                        <label className="oc-check">
                                            <input type="checkbox" value="5" checked={ this.state.communicationProtocol === '5' } onChange={ this.onCommunicationProtocolChanged } />
                                            X400 Network (VAN)
                                        </label>
                                        <br/>
                                        <label className="oc-check">
                                            <input type="checkbox" value="6" checked={ this.state.communicationProtocol === '6' } onChange={ this.onCommunicationProtocolChanged } />
                                            GXS TRADING GRID
                                        </label>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="oc-check">
                                            <input type="checkbox" value="7" checked={ this.state.communicationProtocol === '7' } onChange={ this.onCommunicationProtocolChanged } />
                                            Evenex
                                        </label>
                                        <br/>
                                        <label className="oc-check">
                                            <input type="checkbox" value="8" checked={ this.state.communicationProtocol === '8' } onChange={ this.onCommunicationProtocolChanged } />
                                            Telema
                                        </label>
                                        <br/>
                                        <label className="oc-check">
                                            <input type="checkbox" value="9" checked={ this.state.communicationProtocol === '9' } onChange={ this.onCommunicationProtocolChanged } />
                                            X400 Network (VAN)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-1">
                        <label className="oc-radio">
                            <Radio onChange={ this.onCommunicationTypeChanged } checked={ this.state.communicationType === 'FTP' } value="FTP"/>
                        </label>
                    </div>
                    <div className="col-md-11">
                        <form className="form-horizontal">
                            <div className="row">
                                <div className="form-group">
                                    <label className="col-sm-1 control-label">FTP</label>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <br/>
                <hr/>
                <h4>Contact Person</h4>
                <form className="form-horizontal">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="col-sm-3 control-label">Name</label>
                                <div className="col-sm-9">
                                    <FormControl type="text" value={ this.state.contactName } placeholder="Name" onChange={ this.onContactNameChanged }/>
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="col-sm-3 control-label">Telephone</label>
                                <div className="col-sm-9">
                                    <FormControl type="text" value={ this.state.contactPhone } placeholder="+491732185516" onChange={ this.onContactPhoneChanged }/>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label className="col-sm-3 control-label">EMail Address</label>
                                <div className="col-sm-9">
                                    <FormControl type="text" value={ this.state.contactEmail } placeholder="name@company.com" onChange={ this.onContactEmailChanged }/>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="form-submit text-right">
                    <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>Previous</Button>
                    <Button bsStyle="primary" disabled={false} onClick={ () => this.props.onNext() }>
                        Save &amp; Continue
                    </Button>
                </div>
            </div>
        )
    }
}

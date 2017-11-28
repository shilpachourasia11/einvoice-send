import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import { Button,Col } from 'react-bootstrap';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';
import translations from './i18n'
import Promise from 'bluebird';


export default class ServiceConfigFlow1 extends Components.ContextComponent
{
    static propTypes = {
        accepted : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        voucher: React.PropTypes.object,
        inChannelConfig : React.PropTypes.object,
    };

    static defaultProps = {
        accepted : false
    };

    constructor(props, context)
    {
        super(props);

        context.i18n.register('ServiceConfigFlowEinvoice', translations);

        this.state = {
            accepted : this.props.accepted
        }
    }

    componentWillMount() {
        this.loadInChannelContract();
    }

    componentWillReceiveProps(props) {
        this.props = props;
        this.loadInChannelContract();
    }

    loadInChannelContract() {
        ajax.get('/einvoice-send/api/config/inchannelcontracts/c_' + this.props.voucher.customerId + '/s_' + this.props.voucher.supplierId)
            .set('Content-Type', 'application/json')
        .then ((contract) => {
            if (contract && contract.body && contract.body.inputType == 'einvoice') {
                this.setState({
                    accepted : (contract.body.status == 'approved')
                });
            }
        })
        .catch((e) => {
            console.log("Error determined when fetching InChannelContract for c_" + this.props.voucher.customerId + " and s_" + this.props.voucher.supplierId + ": ", e);
        });
    }


    render()
    {
        const customerId = this.props.voucher.customerId;
        const customerName = this.props.voucher.customerName;
        const localeExt = (!this.context.locale || this.context.locale == 'en') ? "" : ("_" + this.context.locale);
        const pdfUrl = "/blob/public/api/c_" + customerId + "/files/public/einvoice-send/SupplierEInvoicingGuide" + localeExt + ".pdf";

        return (
            <div>
                <h3>{this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step1.subheader', {customerName:this.props.voucher.customerName})}</h3>
                <div>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step1.intro', {customerName:this.props.voucher.customerName})}
                </div>
                <br/>
                <div>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step1.subsubheader', {customerName:this.props.voucher.customerName})}
                </div>

                <hr/>

                <div className="bs-callout bs-callout-info">
                    <p>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step1.text1',
                            {customerName : customerName, customerId : customerId})}
                        <ul>
                            <li>
                                {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step1.li1',
                                    {customerName : customerName, customerId : customerId})}
                            </li>
                            <li>
                                {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step1.li2',
                                    {customerName : customerName, customerId : customerId})}
                            </li>
                            <li>
                                {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step1.li3',
                                    {customerName : customerName, customerId : customerId})}
                            </li>
                            <li>
                                {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step1.li4',
                                    {customerName : customerName, customerId : customerId})}
                            </li>
                        </ul>
                    </p>
                    <p>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step1.moreInfo',
                            {customerName : customerName, customerId : customerId})}
                        &nbsp;&nbsp;
                        <a href={pdfUrl} className="btn btn-info" target="_blank">
                            <span className="glyphicon glyphicon-file"></span>
                        </a>
                     </p>
                </div>

                <hr/>

                <div>
                    <label className="oc-check">
                        <input type="checkbox" checked={ this.state.accepted } onChange={ e => this.setState({ accepted: e.target.checked }) }/>
                        <a href="#" onClick={e => { this.setState({ accepted: !this.state.accepted }); e.preventDefault(); }}>
                            {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step1.accepted', {customerName: customerName})}
                        </a>
                    </label>
                </div>

                <div className="form-submit text-right" style={{ marginTop: '80px' }}>
                    <Button bsStyle="primary" disabled={ !this.state.accepted } onClick={ () => this.props.onNext() }>
                        {this.context.i18n.getMessage('accept')}
                    </Button>
                </div>
            </div>
        )
    }
}

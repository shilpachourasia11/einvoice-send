import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import translations from './i18n';
import { Button } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';
import Promise from 'bluebird';

export default class ServiceConfigFlowTaCCustomer extends Components.ContextComponent
{
    static propTypes = {
        accepted : React.PropTypes.bool,
        customerTermsAndConditions : React.PropTypes.string,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired,
        voucher: React.PropTypes.object,
        inChannelConfig : React.PropTypes.object,
        targetType: React.PropTypes.string
    };

    static defaultProps = {
        accepted : false,
        customerTermsAndConditions : ""
    };

    constructor(props, context)
    {
        super(props)

        context.i18n.register('ServiceConfigFlowTaCCustomer', translations);

        this.state = {
            accepted : this.props.accepted,
            customerTermsAndConditions : this.props.customerTermsAndConditions
        }
    }

    componentDidMount() {
        return Promise.all([
            this.setTermsAndConditions(this.context.locale),
            this.loadInChannelContract()
        ])
    }

    loadInChannelContract() {
        return ajax.get('/einvoice-send/api/config/inchannelcontracts/c_' + this.props.voucher.customerId + '/s_' + this.props.voucher.supplierId)
        .then ((contract) => {
            let targetType = this.props.targetType ? this.props.targetType : this.props.inChannelConfig.inputType;
            if (contract && contract.body && contract.body.inputType == targetType) {
                this.setState({
                    accepted : (contract.body.status == 'approved')
                });
            }
        })
        .catch((e) => {
            //console.log("Error determined when fetching InChannelContract for c_" + this.props.voucher.customerId + " and s_" + this.props.voucher.supplierId + ": ", e);
            this.showNotification(e.message, 'error', 10);
        });
    }


    setTermsAndConditions(locale) {
        return this.getCustomerTermsAndConditions(locale)
        .then ((newTermsAndConditions) => {
            this.setState({ customerTermsAndConditions: newTermsAndConditions.text });
        })
        .catch((e) => {
            //console.log("Error determined when fetching customer T&C for c_" + this.props.voucher.customerId + ": ", e);
            this.showNotification(e.message, 'error', 10);
        })
    }

    getCustomerTermsAndConditions(locale) {
        return ajax.get('/blob/public/api/c_' + this.props.voucher.customerId + '/files/public/einvoice-send/TermsAndConditions_' + locale + '.html')
        .catch((e) => {
            return ajax.get('/blob/public/api/c_' + this.props.voucher.customerId +  '/files/public/einvoice-send/TermsAndConditions.html')
        })
    }

    render()
    {
        return (
            <div>
                <h3>{this.context.i18n.getMessage('CustomerTaC.subheader', {customerName:this.props.voucher.customerName})}</h3>
                <div>
                    {this.context.i18n.getMessage('CustomerTaC.subsubheader')}
                </div>

                <hr/>

                <div className="bs-callout bs-callout-info">
                    <div dangerouslySetInnerHTML={{__html: this.state.customerTermsAndConditions}}></div>
                </div>

                <hr/>

                <div className="col-md-6">
                    <label className="oc-check">
                        <input type="checkbox" checked={ this.state.accepted } onChange={ e => this.setState({ accepted: e.target.checked }) }/>
                        <a href="#" onClick={e => { this.setState({ accepted: !this.state.accepted }); e.preventDefault(); }}>
                            {this.context.i18n.getMessage('CustomerTaC.readTaC', {customerName:this.props.voucher.customerName})}
                        </a>
                    </label>
                </div>

                <div className="form-submit text-right" style={{ marginTop: '80px' }}>
                <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>
                    {this.context.i18n.getMessage('previous')}
                </Button>
                <Button bsStyle="primary" disabled={ !this.state.accepted } onClick={ () => this.props.onNext() }>
                    {this.context.i18n.getMessage('accept')}
                </Button>
                </div>
            </div>
        )
    }
}

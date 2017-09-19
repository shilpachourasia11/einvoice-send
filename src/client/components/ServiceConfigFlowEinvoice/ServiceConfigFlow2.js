import React from 'react';
import { Button } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';  // ??? move to app.js ???
import Promise from 'bluebird';


export default class ServiceConfigFlow2 extends React.Component {

    static propTypes = {
        accepted : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired,
        voucher: React.PropTypes.object,
        inChannelConfig : React.PropTypes.object,
    };

    static defaultProps = {
        accepted : false
    };

    constructor(props)
    {
        super(props)

        this.state = {
            accepted : this.props.accepted
        }
    }

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
        locale : React.PropTypes.string
    };


    componentWillMount() {
        this.loadInChannelContract();
    }

    componentWillReceiveProps() {
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
                <h3>{this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step2.subheader', {customerName:this.props.voucher.customerName})}</h3>
                <div>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step2.subsubheader', {customerName:this.props.voucher.customerName})}
                </div>

                <hr/>

                <div className="bs-callout bs-callout-info">
                    <p>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step2.text1',
                            {customerName : customerName, customerId : customerId})}
                        <ul>
                            <li>
                                {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step2.li1',
                                    {customerName : customerName, customerId : customerId})}
                            </li>
                            <li>
                                {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step2.li2',
                                    {customerName : customerName, customerId : customerId})}
                            </li>
                            <li>
                                {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step2.li3',
                                    {customerName : customerName, customerId : customerId})}
                            </li>
                            <li>
                                {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step2.li4',
                                    {customerName : customerName, customerId : customerId})}
                            </li>
                        </ul>
                    </p>
                    <p>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step2.moreInfo',
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
                            {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.Step2.accepted', {customerName: customerName})}
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

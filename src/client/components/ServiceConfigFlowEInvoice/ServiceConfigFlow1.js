import React from 'react';
import { Button } from 'react-bootstrap';
//import browserHistory from 'react-router/lib/browserHistory';
import ajax from 'superagent-bluebird-promise';

export default class ServiceConfigFlow1 extends React.Component {

    static propTypes = {
        accepted : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        ocTermsAndConditions : React.PropTypes.string
    };

    static defaultProps = {
        accepted : false
    };

    constructor(props)
    {
        super(props)

        this.state = {
            accepted : this.props.accepted,
            ocTermsAndConditions : 'loading OpusCapita Terms and Conditions...'
        }
    }

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };

//    componentDidMount() {
//      console.log(">>>> ServiceConfigFlow1 - props", this.props);
//    }

    getOcHtmlTermsAndConditions() {
        // TODO: Fetch text from Server
        // TODO: Language dependent determination of the terms and conditions

        let htmlText = `
            <h4>E-invoice Sending</h4>
            <ul>
                <li>Connect with your existing service provider for e-invoicing</li>
                <li>
                    Simply utilize your operator from our partner list (list of available partners
                    can be seen on below Supplier Guideline description) and send the E-invoices
                    to [Customer].
                </li>
                <li>
                    E-invoice sending means that invoice data with the invoice picture is taken
                    directly from your billing system and sent to your service provider who then
                    routes the e-invoices to OpusCapita which delivers the E-invoices to [Customer].
                    The usage of operator ID and e-invoice address are required. You will see
                    correct ID and address information on below Supplier Guideline description.
                </li>
                <li>
                    In case of your operator is new to us, OpusCapita takes care of the technical
                    details with the operator.
                </li>
            </ul>
        `;

        let str = htmlText.replace(/\[Customer\]/g, this.props.voucher.customerName)
        return { __html : str };
    }


    render()
    {
        return (
            <div>
                <h3>{this.context.i18n.getMessage('congratulations')}</h3>
                <div>
                    {this.context.i18n.getMessage('ServiceConfigFlow.EInvoice.subheader', {customer : this.props.voucher.customerName})}
                </div>

                <hr/>

                <div className="bs-callout bs-callout-info">
                    <div dangerouslySetInnerHTML={this.getOcHtmlTermsAndConditions()} />
                </div>

                <hr/>

                <div className="col-md-6">
                    <label className="oc-check">
                        <input type="checkbox" checked={ this.state.accepted } onChange={ e => this.setState({ accepted: e.target.checked }) }/>
                        <a href="#" onClick={e => { this.setState({ accepted: !this.state.accepted }); e.preventDefault(); }}>
                            {this.context.i18n.getMessage('ServiceConfigFlow.readOCTaC')}
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

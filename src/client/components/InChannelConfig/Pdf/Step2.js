import React from 'react';
import { Button } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';
import Promise from 'bluebird';


export default class PdfStep2 extends React.Component {

    static propTypes = {
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired,
        inChannelConfig : React.PropTypes.object
    };

    static defaultProps = {
    };

    constructor(props)
    {
        super(props)

        this.state = {
            accepted : false,
            customerTermsAndConditions : null
        }
    }

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
        locale : React.PropTypes.string
    };


    componentDidMount() {
        this.locale = this.context.locale;
        this.setTermsAndConditions(this.context.locale);
        this.setState({ accepted : !!this.props.inChannelContract });
    }

    componentWillReceiveProps(nextProps) {
console.log("Step2 - WillReceiveProps: currentProps", nextProps);
console.log("Step2 - WillReceiveProps: nextProps   ", nextProps);

        // TODO: Change in case of local change!
        let nextLang = nextProps.user.languageid
        if (this.locale != nextLang) {
            this.locale = nextLang;
            this.setTermsAndConditions(nextLang);
        }
        if (!this.state.accepted && nextProps.inChannelContract ) {
            this.setState({ accepted : true });
        }
    }

    setTermsAndConditions(locale) {
        let customerId = this.props.customer.customerId;

        this.getCustomerTermsAndConditions(customerId, locale)
        .then ((termsAndConditions) => {
            this.setState({ customerTermsAndConditions: termsAndConditions.text });
        })
        .catch((e) => {
// ??? ???           this.setState({ customerTermsAndConditions: null });
            this.setState({ customerTermsAndConditions: "Test Test Test" });
        });
    }

    getCustomerTermsAndConditions(customerId, locale) {
        return ajax.get('/blob/public/api/c_' + customerId + '/files/public/einvoice-send/TermsAndConditions_' + locale + '.html')
        .catch((e) => {
            return ajax.get('/blob/public/api/c_' + customerId +  '/files/public/einvoice-send/TermsAndConditions.html')
        })
    }



    render()
    {
        let customer = this.props.customer;

        return (
            <div>
                <h3>{this.context.i18n.getMessage('ServiceConfigFlow.CustomerTaC.subheader', {customerName:customer.customerName})}</h3>
                <div>
                    {this.context.i18n.getMessage('ServiceConfigFlow.CustomerTaC.subsubheader')}
                </div>

                <hr/>

                <div className="bs-callout bs-callout-info">
                    {this.state.customerTermsAndConditions
                        ? <div dangerouslySetInnerHTML={{__html: this.state.customerTermsAndConditions}}></div>
                        : <h1> No Customer Terms and Conditions found! Please contact your customer to proceed ??? </h1>
                    }
                </div>

                <hr/>

                <div className="col-md-6">
                    <label className="oc-check">
                        <input type="checkbox" checked={ this.state.accepted } onChange={ e => this.setState({ accepted: e.target.checked }) }/>
                        <a href="#" onClick={e => { this.setState({ accepted: !this.state.accepted }); e.preventDefault(); }}>
                            {this.context.i18n.getMessage('ServiceConfigFlow.CustomerTaC.readTaC', {customerName:customer.customerName})}
                        </a>
                    </label>
                </div>

                <div className="form-submit text-right" style={{ marginTop: '80px' }}>
                    <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>
                        {this.context.i18n.getMessage('previous')}
                    </Button>
                    <Button bsStyle="primary" disabled={ !(this.state.customerTermsAndConditions && this.state.accepted) }
                        onClick={ () => {this.props.onNext()} }
                    >
                        {this.context.i18n.getMessage('accept')}
                    </Button>
                </div>
            </div>
        )
    }
}

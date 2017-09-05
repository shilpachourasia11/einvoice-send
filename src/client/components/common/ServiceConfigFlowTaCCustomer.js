import React from 'react';
import { Button } from 'react-bootstrap';
//import browserHistory from 'react-router/lib/browserHistory';
import ajax from 'superagent-bluebird-promise';
import Promise from 'bluebird';


export default class ServiceConfigFlow2 extends React.Component {

    static propTypes = {
        accepted : React.PropTypes.bool,
        customerTermsAndConditions : React.PropTypes.string,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired,
    };

    static defaultProps = {
        accepted : false,
        customerTermsAndConditions : ""
    };

    constructor(props)
    {
        super(props)

        this.state = {
            accepted : this.props.accepted,
            customerTermsAndConditions : this.props.customerTermsAndConditions
        }
    }

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
        locale : React.PropTypes.string
    };


    componentWillMount() {
        this.setTermsAndConditions(this.context.locale);
    }

    setTermsAndConditions(locale) {
        this.getCustomerTermsAndConditions(locale)
        .then ((newTermsAndConditions) => {
            this.setState({ customerTermsAndConditions: newTermsAndConditions.text })
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
                <h3>{this.context.i18n.getMessage('ServiceConfigFlow.CustomerTaC.subheader', {customerName:this.props.voucher.customerName})}</h3>
                <div>
                    {this.context.i18n.getMessage('ServiceConfigFlow.CustomerTaC.subsubheader')}
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
                            {this.context.i18n.getMessage('ServiceConfigFlow.CustomerTaC.readTaC', {customerName:this.props.voucher.customerName})}
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

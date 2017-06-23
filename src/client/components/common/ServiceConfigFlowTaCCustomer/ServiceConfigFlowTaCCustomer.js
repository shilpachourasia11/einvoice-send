import React from 'react';
import { Button } from 'react-bootstrap';
//import browserHistory from 'react-router/lib/browserHistory';
import ajax from 'superagent-bluebird-promise';
import Promise from 'bluebird';


export default class ServiceConfigFlow2 extends React.Component {

    static propTypes = {
        accepted : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired,
        customerTermsAndConditions : React.PropTypes.string
    };

    static defaultProps = {
        accepted : false
    };

    constructor(props)
    {
        super(props)

        this.state = {
            accepted : this.props.accepted,
            customerTermsAndConditions : 'loading Customers Terms and Conditions...'
        }
    }

    componentDidMount() {
console.log(">> pdf/ServiceConfigFlowTacCustomer - componentDidMount is called.");
console.log(">> pdf/ServiceConfigFlowTacCustomer - customerId: ", this.props.voucher.customerId);

        return ajax.get('/einvoice-send/api/config/termsandconditions/' + this.props.voucher.customerId)
            .set('Content-Type', 'application/json')   // ??? really needed?
            .promise()
        .then((result) => {
            this.setState({customerTermsAndConditions : result.text});
        })
        .catch((error) => {
            // TODO: error handling ???
        })
    }


    componentWillReceiveProps() {

    }


    render()
    {
        return (
            <div>
                <h3>Terms and Conditions of <em>{this.props.voucher.customerId}</em></h3>  {/* ??? How to access the Customer that initiated the Onboarding*/}
                <div>
                    Please check the terms and conditions below and confirm your acceptance at the end of this page.
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
                            I read and understood the terms and conditions of Customer <em>{this.props.voucher.customerId}</em>.
                        </a>
                    </label>
                </div>

                <div className="form-submit text-right" style={{ marginTop: '80px' }}>
                <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>
                    Previous
                </Button>
                <Button bsStyle="primary" disabled={ !this.state.accepted } onClick={ () => this.props.onNext() }>
                    Submit
                </Button>
                </div>
            </div>
        )
    }
}

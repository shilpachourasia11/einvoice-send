import React from 'react';
import { Button } from 'react-bootstrap';
//import browserHistory from 'react-router/lib/browserHistory';
import ajax from 'superagent-bluebird-promise';

export default class ServiceConfigFlow1 extends React.Component {

    static propTypes = {
        accepted : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired,
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

    componentDidMount() {
console.log(">> pdf/ServiceConfigFlow1 - componentDidMount is called.");

        return ajax.get('/einvoice-send/api/config/octermsandconditions')
            .set('Content-Type', 'application/json')   // ??? really needed?
            .promise()
        .then((result) => {
            this.setState({ocTermsAndConditions : result.text});
        })
        .catch((error) => {
            // TODO: error handling ???
        })
    }

    render()
    {
        return (
            <div>
                <h3>Business Portal Terms and Conditions</h3>
                <div>
                    Please check the terms and conditions below and confirm your acceptance at the end of this page.
                </div>

                <hr/>

                <div className="bs-callout bs-callout-info">
                    <br/>
                    <br/>
                    <h4 id="callout-progress-csp">{this.state.eInvoiceTypes}</h4>
                    <br/>
                    <br/>
                </div>

                <hr/>

                <div className="col-md-6">
                    <label className="oc-check">
                        <input type="checkbox" checked={ this.state.accepted } onChange={ e => this.setState({ accepted: e.target.checked }) }/>
                        <a href="#" onClick={e => { this.setState({ accepted: !this.state.accepted }); e.preventDefault(); }}>
                            I have read and understood the terms and conditions for the invoice portal.
                        </a>
                    </label>
                </div>

                <div className="form-submit text-right" style={{ marginTop: '80px' }}>
                {/* <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>Previous</Button> */}
                <Button bsStyle="primary" disabled={ !this.state.accepted } onClick={ () => this.props.onNext() }>
                    Submit
                </Button>
                </div>
            </div>
        )
    }
}

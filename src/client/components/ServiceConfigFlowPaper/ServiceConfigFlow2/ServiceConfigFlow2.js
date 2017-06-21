import React from 'react';
import { Button } from 'react-bootstrap';
//import browserHistory from 'react-router/lib/browserHistory';

export default class ServiceConfigFlow2 extends React.Component {

    static propTypes = {
        accepted : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired
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

    render()
    {
        return (
            <div>
                <h3>Terms and Conditions of xxx</h3>  {/* ??? How to access the Customer that initiated the Onboarding*/}
                <div>
                    Please check the terms and conditions below and confirm your acceptance at the end of this page.
                </div>

                <hr/>

                <div className="bs-callout bs-callout-info">
                    <br/>
                    <br/>
                    <h4 id="callout-progress-csp">...OpusCapita Terms and Conditions...</h4>
                    <br/>
                    <br/>
                </div>

                <hr/>

                <div className="col-md-6">
                    <label className="oc-check">
                        <input type="checkbox" checked={ this.state.accepted } onChange={ e => this.setState({ accepted: e.target.checked }) }/>
                        <a href="#" onClick={e => { this.setState({ accepted: !this.state.accepted }); e.preventDefault(); }}>
                            I read and understood the terms and conditions of "Customer xxx">.  {/* ??? How to access the Customer that initiated the Onboarding*/}
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

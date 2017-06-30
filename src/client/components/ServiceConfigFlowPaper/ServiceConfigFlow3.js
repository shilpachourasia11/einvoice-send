import React from 'react';
import { Button } from 'react-bootstrap';
//import browserHistory from 'react-router/lib/browserHistory';

export default class ServiceConfigFlow5 extends React.Component {

    static propTypes = {
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired
    };

    static defaultProps = {
    };

    constructor(props)
    {
        super(props)

        this.state = {
        }
    }

    render()
    {
        return (
            <div>
                <h3>Next Steps</h3>

                <p>
                All required steps from your side are done.
                </p>

                <p>
                Please send your invoices to
                <br/>
                <br/>
                OpusCapita
                <br/>
                Lindemannstraße 57
                <br/>
                44137 Dortmund
                <br/>
                Germany
                </p>

                <div className="form-submit text-right" style={{ marginTop: '80px' }}>
                    <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>
                        Previous
                    </Button>
                    <Button bsStyle="primary" onClick={ () => this.props.onNext() }>
                        Submit
                    </Button>
                </div>
            </div>
        )
    }
}

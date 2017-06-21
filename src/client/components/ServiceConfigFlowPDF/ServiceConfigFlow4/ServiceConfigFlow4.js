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
                Now that you have uploaded the invoice example, we will setup
                the automated processing of your invoices.
                <br/>
                Usually this will take <em>X</em> days.
                </p>

                <p>
                You will receive an notification {/* TODO: ??? at <em>xxx@yyy.zz</em> */}as soon   {/* ??? How to access the email address for the notification? */}
                as the required setup is done. This email will also provide
                the email address that you have to use to send your invoices to
                us. Please use this email address only.
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

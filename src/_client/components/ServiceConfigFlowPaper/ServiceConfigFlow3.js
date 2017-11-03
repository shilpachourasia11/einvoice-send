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

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };


    render()
    {
        return (
            <div>
                <h3>{this.context.i18n.getMessage('ServiceConfigFlow.Paper.Approve.header')}</h3>

                <p>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Paper.Approve.subheader')}
                </p>

                <p>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Paper.Approve.text')}
                </p>

                <p>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Paper.Approve.textFooter')}
                </p>
                <p>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Paper.Approve.textGreetings')}
                </p>

                <div className="form-submit text-right" style={{ marginTop: '80px' }}>
                    <Button bsStyle="link" onClick={ () => this.props.onPrevious() }>
                        {this.context.i18n.getMessage('previous')}
                    </Button>
                    <Button bsStyle="primary" onClick={ () => this.props.onNext() }>
                        {this.context.i18n.getMessage('accept')}
                    </Button>
                </div>
            </div>
        )
    }
}

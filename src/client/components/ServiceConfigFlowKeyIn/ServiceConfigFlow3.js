import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import { Button } from 'react-bootstrap';
import translations from './i18n';

export default class ServiceConfigFlow3 extends Components.ContextComponent
{
    static propTypes = {
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired
    };

    static defaultProps = {
    };

    constructor(props, context)
    {
        super(props)

        context.i18n.register('ServiceConfigFlowKeyIn', translations);

        this.state = {
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.props = nextProps;
        this.setState({ });
    }

    render()
    {
        return (
            <div>
                <h3>{this.context.i18n.getMessage('ServiceConfigFlow.KeyIn.Step3.header')}</h3>

                <p>
                    {this.context.i18n.getMessage('ServiceConfigFlow.KeyIn.Step3.subheader')}
                </p>
                <p>
                    {this.context.i18n.getMessage('ServiceConfigFlow.KeyIn.Step3.textFooter')}
                </p>
                <p>
                    {this.context.i18n.getMessage('ServiceConfigFlow.KeyIn.Step3.textGreetings')}
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

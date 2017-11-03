import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import translations from './i18n';
import { Button } from 'react-bootstrap';

export default class ServiceConfigFlow5 extends Components.ContextComponent
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

        context.i18n.register('ServiceConfigFlowPdf', translations);

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
                <h3>{this.context.i18n.getMessage('ServiceConfigFlow.Pdf.Approve.header')}</h3>

                <p>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Pdf.Approve.subheader')}
                </p>

                <p>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Pdf.Approve.text')}
                </p>

                <p>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Pdf.Approve.textFooter')}
                </p>
                <p>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Pdf.Approve.textGreetings')}
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

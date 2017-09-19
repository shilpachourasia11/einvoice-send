import React from 'react';
import { Button,Col } from 'react-bootstrap';
import {Form, FormGroup, FormControl, ControlLabel, HelpBlock} from 'react-bootstrap';


export default class ServiceConfigFlow1 extends React.Component {

    static propTypes = {
        accepted : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        inChannelConfig : React.PropTypes.object,
    };

    static defaultProps = {
        accepted : false
    };

    constructor(props)
    {
        super(props)

        this.state = {
            accepted : this.props.accepted,
            rejection:false,
            validate:null
        }
    }

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
        locale: React.PropTypes.string
    };


    render()
    {
        return (
            <div>
                <h3>{this.context.i18n.getMessage('welcome')}</h3>
                <div>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.OCTaC.text',
                        {customerName : this.props.voucher.customerName, customerId : this.props.voucher.customerId})}
                </div>

                <hr/>

                <div className="form-submit text-right">
                    <Button bsStyle="primary" onClick={ () => this.props.onNext() }>
                        {this.context.i18n.getMessage('accept')}
                    </Button>
                </div>
            </div>
        )
    }
}

import React from 'react';
import { Button } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';  // ??? move to app.js ???
import Promise from 'bluebird';


export default class ServiceConfigFlow2 extends React.Component {

    static propTypes = {
        accepted : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        onPrevious : React.PropTypes.func.isRequired,
        voucher: React.PropTypes.object
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

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
        locale : React.PropTypes.string
    };


    componentWillMount() {

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
                    <p>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.CustomerTaC.text1',
                            {customerName : this.props.voucher.customerName, customerId : this.props.voucher.customerId})}
                    </p>
                    <p>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.CustomerTaC.text2',
                            {customerName : this.props.voucher.customerName, customerId : this.props.voucher.customerId})}
                        {/* TODO: Replace link with correct one as soon as uploaded on the blob server.*/}
                        <a href="/blob/public/api/opuscapita/files/public/docs/SupplierManual.pdf" className="btn btn-info">
                            <span className="glyphicon glyphicon-file"></span>
                        </a>
                     </p>

                    <p>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.CustomerTaC.text3',
                            {customerName : this.props.voucher.customerName, customerId : this.props.voucher.customerId})}
                    </p>
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

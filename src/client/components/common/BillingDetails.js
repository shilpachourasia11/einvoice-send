import React from 'react';
import { Button } from 'react-bootstrap';

export default class BillingDetails extends React.Component {

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };

    render() {
        var styleFree = {
            float:"right",
            color:"#5ab95a",
            fontWeight:"bold"
        };

        // TODO: How will billing details get structured and provided? To be defined!
        // TODO: Display details on how billing is done.
        //
        if(this.props.inputType === "eInvoice" && this.props.voucher[this.props.inputType + "Enabled"]) {
            return (
                <div style={styleFree}>
                    {this.context.i18n.getMessage('ServiceConfigFlowStart.freeFor', {customerName : this.props.voucher.customerName})}
                    <br/>
                    {this.context.i18n.getMessage('ServiceConfigFlowStart.add2EInvoice', {customerName : this.props.voucher.customerName})}
                </div>
            );
        }
        else if (this.props.inputType && this.props.voucher[this.props.inputType + "Enabled"]) {
            return (
                <span style={styleFree}>{this.context.i18n.getMessage('ServiceConfigFlowStart.freeFor', {customerName : this.props.voucher.customerName})}</span>
            );
        }
        else {
            return null;
        }
    }
}

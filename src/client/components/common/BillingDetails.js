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
            return null; // We don't know anything about the billing for external eInvoicing.
        }
        else if(this.props.inputType === "supplierPortal" && this.props.voucher[this.props.inputType + "Enabled"]) {
            return (
              <span style={styleFree}>{this.context.i18n.getMessage('ServiceConfigFlowStart.intention')}</span>
            ) // May be the same as eInvoice?!
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

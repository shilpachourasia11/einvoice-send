import React from 'react';
import { Button } from 'react-bootstrap';

export default class BillingDetails extends React.Component {

    render() {
        var styleFree = {
            float:"right",
            color:"#5ab95a",
            fontWeight:"bold"
        };

        // TODO: How will billing details get structured and provided? To be defined!
        // TODO: Display details on how billing is done.
        //
        if (this.props.inputType && this.props.voucher[this.props.inputType + "Enabled"]) {
            return (
                <span style={styleFree}>Free for {this.props.voucher.customerName}</span>
            );
        }
        else {
            return null;
        }
    }
}

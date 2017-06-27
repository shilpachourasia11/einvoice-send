import React from 'react';
import { Button } from 'react-bootstrap';

export default class BillingDetails extends React.Component {

    render() {
        var styleFree = {
            float:"right",
            color:"#5ab95a",
            fontWeight:"bold"
        };

        // TODO: Display details on how billing is done.
        //       But how will billing details get structured and provided? To be defined!
        //
        if (this.props.inputType && this.props.voucher[this.props.inputType + "Enabled"]) {
            return (
                <span style={styleFree}>FREE</span>
            );
        }
        else {
            return null;
        }
    }
}

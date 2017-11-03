import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import translations from './i18n';

export default class BillingDetails extends Components.ContextComponent
{
    constructor(props, context) {
        super(props);

        context.i18n.register('BillingDetails', translations);
    }
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
                    {this.context.i18n.getMessage('BillingDetails.freeFor', {customerName : this.props.voucher.customerName})}
                    <br/>
                    {this.context.i18n.getMessage('BillingDetails.add2EInvoice', {customerName : this.props.voucher.customerName})}
                </div>
            );
        }
        else if (this.props.inputType && this.props.voucher[this.props.inputType + "Enabled"]) {
            return (
                <span style={styleFree}>{this.context.i18n.getMessage('BillingDetails.freeFor', {customerName : this.props.voucher.customerName})}</span>
            );
        }
        else {
            return null;
        }
    }
}

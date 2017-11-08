import React, { PropTypes } from 'react';
import { Components } from '@opuscapita/service-base-ui';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import ajax from 'superagent-bluebird-promise';

export default class KeyIn extends Components.ContextComponent {

	constructor(props) {
		super(props);
	}

    componentWillMount()
    {
        const SimpleInvoiceEditor = serviceComponent({
            serviceRegistry : (service) => ({ url:'/sales-invoice' }),
            serviceName: 'sales-invoice',
            moduleName: 'invoice_editor',
            jsFileName: 'invoice_editor-bundle',
            componentPath: 'SimpleInvoiceEditor'
        });

        this.InvoiceEditorForm = {SimpleInvoiceEditor}
    }

    render() {
        // TODO: Check which additional params we have/can use.

        // context: currentUserData and showNotification are both required as contextTypes
        // props: invoiceId, createMode, readOnly(boolean) and a functon. There are listed in the propTypes.

        const {SimpleInvoiceEditor} = this.InvoiceEditorForm;
        return (
            <div>
                <SimpleInvoiceEditor createMode={true} readOnly={false} />
            </div>
        )
    }

}

import React, { PropTypes } from 'react';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import ajax from 'superagent-bluebird-promise';

export default class KeyIn extends React.Component {

    static contextTypes = {
        currentUserData : React.PropTypes.object.isRequired
    };

	constructor(props) {
		super(props);
	}

    componentWillMount()
    {
        this.InvoiceEditorForm = serviceComponent({
            serviceRegistry : (service) => ({ url:'/invoice' }),
            serviceName: 'invoice',
            moduleName: 'invoice_editor',
            jsFileName: 'invoice_editor-bundle',
            componentPath: 'SimpleInvoiceEditor'
        });
console.log(">>>>>>>>>>>>>>", this.InvoiceEditorForm);
    }

    render() {
console.log("*** this.context.currentUserData: ", this.context.currentUserData);

        return (
            <div>
                <h1>Test Test Test</h1>
                <this.InvoiceEditorForm/>
            </div>
        )
    }

}

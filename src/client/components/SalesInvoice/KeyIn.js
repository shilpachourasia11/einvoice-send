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
    }

    render() {

        // context: currentUserData and showNotification are both required as contextTypes
        // props: invoiceId, createMode, readOnly(boolean) and a functon. There are listed in the propTypes.

        // console.log("*** this.context.currentUserData: ", this.context.currentUserData);

        // TODO: Check which additional params we have/can use.
        // TODO: onCancel ??? Is it needed?
        //    <this.InvoiceEditorForm createMode={true} readOnly={false} onCancel={ (param) =>  alert(param) }/>

        return (
            <div>
                <this.InvoiceEditorForm createMode={true} readOnly={false}/>
            </div>
        )
    }

}

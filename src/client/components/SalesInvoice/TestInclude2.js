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
        this.InvoiceTest = serviceComponent({
            serviceRegistry : (service) => ({ url:'/invoice' }),
            serviceName: 'invoice',
            moduleName: 'sales_invoice_test',
            jsFileName: 'sales_invoice_test-bundle'
            // componentPath: 'Test'
        });
    }

    render() {
        return (
            <div>
                <h1>Sales-Invoice Test Cross-Service-Include</h1>

                <h3>A test component will be included from sales-invoice</h3>
                <br/>
                <br/>

                <this.InvoiceTest userName="<Name passed from TestInclude2>"/>
            </div>
        )
    }

}

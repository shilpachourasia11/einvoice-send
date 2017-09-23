import React, { PropTypes } from 'react';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import ajax from 'superagent-bluebird-promise';

export default class KeyIn extends React.Component {

    static contextTypes = {
        currentUserData : React.PropTypes.object.isRequired,
        locale : React.PropTypes.string
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
            jsFileName: 'sales_invoice_test-bundle',
            componentPath: 'Test'
        });
console.log(">>>>>>>>>>>>>>", this.InvoiceTest);

        this.ConnectSupplierWidget = serviceComponent({
            serviceRegistry: (service) => ({ url: '/einvoice-send' }),
            serviceName: 'einvoice-send',
            moduleName: 'connect-supplier-widget'
        });
        console.log(">>>>>>>>>>>>>>", this.ConnectSupplierWidget);
    }

    render() {
        console.log("this.context.locale: ", this.context.locale);
        return (
            <div>
                <h1>Sales-Invoice Test Cross-Service-Include</h1>

                <h3>A test component will be included from sales-invoice</h3>
                <br/>
                <br/>

                <div className="panel-heading">InvoiceTest...</div>
                <this.InvoiceTest userName="Max Müller"/>

                <div className="panel-heading">ConnectSupplierWidget...</div>
                <div className="panel-body">
                    {<this.ConnectSupplierWidget locale={"de"} actionUrl='' customerId='ncc'/>}
                </div>

            </div>
        )
    }

}

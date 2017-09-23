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

    Test = React.createClass({
      componentWillMount() {
        let serviceRegistry = (service) => ({ url: '/einvoice-send' });
        const testComponent = serviceComponent({
            serviceRegistry,
            serviceName: 'invoice' ,
            moduleName: 'sales_invoice_test',
            jsFileName: 'sales_invoice_test-bundle',
            componentPath: 'Test'
        });
console.log(testComponent);

        this.externalComponents = { testComponent };
      },

      render () {
        const { testComponent } = this.externalComponents;

        return (
          <div className="panel panel-success">
            <div className="panel-heading">Test...</div>
            <div className="panel-body">
                {<testComponent/>}
            </div>
          </div>
        );
      }
    });


    render() {
        return (
            <div>
                <h1>Sales-Invoice Test Cross-Service-Include</h1>

                <h3>A test component will be included from sales-invoice</h3>
                <br/>
                <br/>

                <this.Test/>
            </div>
        )
    }

}

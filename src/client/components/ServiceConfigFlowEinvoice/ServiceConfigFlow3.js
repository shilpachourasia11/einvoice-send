import React from 'react'
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';

export default class ServiceConfigFlow3 extends React.Component {
	constructor(props) {
		super(props);
		
	}
	InvoiceEditor = React.createClass({
		componentWillMount() {
			let serviceRegistry = (service)=> ({ url:'/invoice' });
			const InvoiceEditorForm = serviceComponent({ serviceRegistry, serviceName: 'sales-invoice',moduleName:'InvoiceForm.react' });
			this.externalComponents = { InvoiceEditorForm };
		},
		render() {
			console.log('inside render funciton of inner react class');
			const { InvoiceEditorForm } = this.externalComponents;
			console.log(InvoiceEditorForm);
			return (
				<div>
					<div>
						{<InvoiceEditorForm />}
					</div>
				</div>
			)
		}
	})
	componentDidMount() {
		var me = this

	}
	componentWillMount() {
		console.log('service config flow mounted');
	}
	render() {
		return (
			<div>
				<this.InvoiceEditor />
			</div>
		)
	}
}
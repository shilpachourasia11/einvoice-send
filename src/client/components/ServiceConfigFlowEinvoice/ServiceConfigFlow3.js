import React from 'react'
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';

export default class ServiceConfigFlow3 extends React.Component {
	constructor(props) {
		super(props);
		
	}
	InvoiceEditor = React.createClass({
		componentWillMount() {
			let serviceRegistry = (service)=> ({ url:'/invoice' });
			const InvoiceEditorForm = serviceComponent({ 
				serviceRegistry, 
				serviceName: 'invoice',
				moduleName:'invoice_form',
				jsFileName: 'invoice_form-bundle'
			});
			this.externalComponents = { InvoiceEditorForm };
		},
		render() {
			console.log('inside render funciton of inner react class');
			console.log(this.externalComponents)
			const { InvoiceEditorForm } = this.externalComponents;
			console.log(InvoiceEditorForm)
			return (
				<div>
					<div>
						{
							<InvoiceEditorForm

							/>
						}
					</div>
				</div>
			)
		}
	})
	componentDidMount() {
	}
	componentWillMount() {
	}
	render() {
		return (
			<div>
				<this.InvoiceEditor />
			</div>
		)
	}
}
import React, { PropTypes } from 'react';
import serviceComponent from '@opuscapita/react-loaders/lib/serviceComponent';
import loadCurrentUserData from '../../api/loadCurrentUserData.js';
export default class ServiceConfigFlow3 extends React.Component {
	constructor(props) {
		super(props);
	}
	InvoiceEditor = React.createClass({
		componentWillMount() {
			this.currentUserData = loadCurrentUserData.get()
			let serviceRegistry = (service)=> ({ url:'/invoice' });
			const InvoiceEditorForm = serviceComponent({ 
				serviceRegistry, 
				serviceName: 'invoice',
				moduleName:'invoice_editor',
				jsFileName: 'invoice_editor-bundle',
				componentPath:'SimpleInvoiceEditor'
			});
			this.externalComponents = { InvoiceEditorForm };
		},
		render() {
			const { InvoiceEditorForm } = this.externalComponents;
			return (
				<div>
					<div>
						<InvoiceEditorForm currentUserData = {this.currentUserData} />
					</div>
				</div>
			)
		}
	})

	render() {
		return (
			<div>
				<this.InvoiceEditor />
			</div>
		)
	}
}
<ServiceConfigFlow3 />
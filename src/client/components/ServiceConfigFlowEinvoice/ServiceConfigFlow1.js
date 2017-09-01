import React from 'react';
import {Button} from 'react-bootstrap';
import InChannelConfig from '../../api/InChannelConfig.js';


export default class ServiceConfigFlow1 extends React.Component {

	constructor(props) {
		super(props);

	}
	static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };

    goForward = ()=>{
    	InChannelConfig.update(this.props.voucher.supplierId,{intention:true,inputType:'einvoice'})
    	this.props.gotoStart();
    }

    goBack = ()=> {
    	this.props.gotoStart();
    }

    
	render() {
		return (
			<div>
				<h3>{this.context.i18n.getMessage('welcome')}</h3>

				<div className="bs-callout bs-callout-info">
                    <div>
						{this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.intro', {customerName : this.props.voucher.customerName})}
                    </div>
                </div>

				<div className="form-submit text-right">
					<Button bsStyle = "link" onClick={()=>this.goBack()}>
						{this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.einvoiceNotWanted')}
					</Button>
					<Button bsStyle = "primary" onClick={()=>this.goForward()}>
						{this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.einvoiceWanted')}
					</Button>
				</div>
			</div>
		)
	}
}

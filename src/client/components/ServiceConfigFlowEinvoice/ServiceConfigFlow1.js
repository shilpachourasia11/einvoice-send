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
    	// console.log(this.props)
    	this.props.gotoStart();
    }
    goBack = ()=> {
    	this.props.gotoStart();
    }
	render() {
		return(
			<div className="container">
				<span>{this.context.i18n.getMessage('ServiceConfigFlowStart.intro3')}</span>
				<div className="form-submit text-right">
					<Button bsStyle = "link" onClick={()=>this.goBack()}>
						{this.context.i18n.getMessage('ServiceConfigFlowStart.backToChannel')}
					</Button>
					<Button bsStyle = "primary" onClick={()=>this.goForward()}>
						{this.context.i18n.getMessage('ServiceConfigFlowStart.wantEinvoice')}
					</Button>
				</div>
			</div>
			)
	}
}
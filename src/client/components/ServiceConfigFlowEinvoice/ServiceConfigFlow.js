import React from 'react';
import {Button} from 'react-bootstrap'
export default class ServiceConfigFlow extends React.Component {
	constructor(props) {
		super(props);
		
	}
	static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };
    goForward = ()=>{
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
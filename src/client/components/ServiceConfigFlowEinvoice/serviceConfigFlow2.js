import React from 'react';
import {Button} from 'react-bootstrap';


export default class ServiceConfigFlow2 extends React.Component {

	constructor(props) {
		super(props);

	}
	static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };

	render() {
		return (
			<div>
				{/*<div className="bs-callout bs-callout-info">*/}
                    <div className="bs-callout bs-callout-info">
						{this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.saved')}
                    </div>
                    <div className="bs-callout bs-callout-info">
                    	{this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.intro2')}
                    </div>
                {/*</div>*/}
				<div className="form-submit text-right">
					<Button bsStyle = "primary" onClick={()=>this.props.gotoStart()}>
						{this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.einvoiceWanted')}
					</Button>
				</div>
			</div>
		)
	}
}

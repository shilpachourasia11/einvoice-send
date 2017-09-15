import React from 'react';
import {Button} from 'react-bootstrap';
import InChannelConfig from '../../api/InChannelConfig.js';


export default class ServiceConfigFlow1 extends React.Component {

	constructor(props) {
		super(props);

        this.state = {
            intention : this.props.intention
        };
	}

    static propTypes = {
        inChannelConfig : React.PropTypes.object,
        intention: React.PropTypes.bool
    };

    static defaultProps = {
        intention: null
    };

	static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };


    componentWillMount() {
        this.setState({
            "intention": this.props.inChannelConfig && this.props.inChannelConfig.SupplierPortalConfig && this.props.inChannelConfig.SupplierPortalConfig.intention
        });
    }


    approveIntention = ()=>{
    	InChannelConfig.update(
            this.props.voucher.supplierId,
            {
                inputType:'portal',
                intention:true
            })

        // this.setState({"intention": true});
    	this.props.gotoStart(true);
    }

    rejectIntention = ()=> {
        InChannelConfig.update(
            this.props.voucher.supplierId,
            {
                inputType:'portal',
                intention:false
            })
        // this.setState({"intention": false});
    	this.props.gotoStart(false);
    }


    renderCurrentIntentionState = () => {
        if (this.props.inChannelConfig && this.props.inChannelConfig.SupplierPortalConfig) {
            // let status = this.props.inChannelConfig.SupplierPortalConfig.intention ? "portalRequested" : "portalRejected";
            let status = this.state.intention ? "portalRequested" : "portalRejected";
            return (
                <div>
                    <h5>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Portal.currentStatus')}
                        {this.context.i18n.getMessage('ServiceConfigFlowStart.statuses.' + status)}
                    </h5>
                </div>
            );
        }
    }

	render() {
		return (
			<div>
				<h3>{this.context.i18n.getMessage('welcome')}</h3>

				<div className="bs-callout bs-callout-info">
                    <div>
						{this.context.i18n.getMessage('ServiceConfigFlow.Portal.intro1')}
                    </div>
                    <div>
						{this.context.i18n.getMessage('ServiceConfigFlow.Portal.intro2')}
                    </div>
                </div>

                {this.renderCurrentIntentionState()}

				<div className="form-submit text-right">
					<Button bsStyle = "link" onClick={()=>this.rejectIntention()}>
						{this.context.i18n.getMessage('ServiceConfigFlow.Portal.portalNotWanted')}
					</Button>
					<Button bsStyle = "primary" onClick={()=>this.approveIntention()}>
						{this.context.i18n.getMessage('ServiceConfigFlow.Portal.portalWanted')}
					</Button>
				</div>
			</div>
		)
	}
}
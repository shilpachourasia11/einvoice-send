import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import { Button, Nav, NavItem, Tab, Row } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';
import translations from './i18n'

import ServiceConfigFlow1 from './ServiceConfigFlow1.js';
import ServiceConfigFlow2 from './ServiceConfigFlow2.js';
import ServiceConfigFlow3 from './ServiceConfigFlow3.js';

import InChannelConfig from '../../api/InChannelConfig.js';
import InChannelContract from '../../api/InChannelContract.js';


// A workaround to prevent a browser warning about unknown properties 'active', 'activeKey' and 'activeHref'
// in DIV element.
const MyDiv = () =>
{
    return <div className="connecting-line"/>;
};


export default class ServiceConfigFlow extends Components.ContextComponent
{
    static propTypes = {
        currentTab : React.PropTypes.number,
        lastValidTab : React.PropTypes.number,
        inputType: React.PropTypes.string,
        inChannelConfig: React.PropTypes.object
    };

    static defaultProps = {
        currentTab : 1,
        lastValidTab : 1,
        inputType: null
    };

    constructor(props, context)
    {
        super(props);

        context.i18n.register('ServiceConfigFlowEinvoice', translations);

        this.state = {
            currentTab : this.props.currentTab,
            lastValidTab : this.props.lastValidTab,
            inputType: this.props.inputType
        };

        console.log(this.props);
    }

    componentWillReceiveProps(nextProps)
    {
        this.props = nextProps;
        this.setState({ });
    }


    /////////////////////////////////////////////////////////
    // Events
    /////////////////////////////////////////////////////////

    setApprovedCustomerTc = () => {
        var customerId = this.props.voucher.customerId;
        var supplierId = this.props.voucher.supplierId;
        var voucherId  = this.props.voucher.id;

        return new Promise((resolve, reject) => {
            InChannelConfig.get(supplierId)
            .then((data) => resolve(data))
            .catch((e) => {
                let values =  {
                    inputType: InChannelConfig.types.eInvoice,
                    billingModelId: 'external',
                    voucherId: voucherId
                }
                return InChannelConfig.add(supplierId, values)
                .then((data) => resolve(data))
            })
        })
        .then((data) => {
            let inChannelContractData = {
                customerId: customerId,
                inputType: InChannelConfig.types.eInvoice,
                voucherId: voucherId,
                billingModelId: 'external',
                status: InChannelContract.status.approved
            }

            InChannelContract.get(supplierId, customerId)
            .then((contract) => {
                return InChannelContract.update(supplierId, customerId, inChannelContractData);
            })
            .catch((e) => {
                return InChannelContract.add(supplierId, inChannelContractData)
            })
        })
        .catch((e) => {
            this.context.showNotification(e.message, 'error', 10);
            return Promise.reject();
        })
    }


    finalApprove = () => {
        return InChannelConfig.activate(this.props.voucher.supplierId, {
            status: InChannelConfig.status.activated  // configured
        })
        .then(() => {
            return this.props.finalizeFlow();
        })
        .catch((e) => {
            this.context.showNotification(e.message, 'error', 10);
            alert ("The forwarding to the Invoice mapping team did not succeed. Please retry.")
        })
    }

    setCurrentTab = (tabNo) => {
        this.setState({ currentTab : tabNo });
    }

    approveOcTc = (tabNo) => {
        return InChannelConfig.update(
            this.props.voucher.supplierId,
            {
                status: InChannelConfig.getNextStatus(this.props.inChannelConfig && this.props.inChannelConfig.status, InChannelConfig.status.approved)
            })
        .then(() => this.setCurrentTab(tabNo));
    }

    approveCustomerTC = (tabNo) => {
        return this.setApprovedCustomerTc()
        .then(() => this.setCurrentTab(tabNo));
        // .then(() => {
        //     this.finalApprove()
        // })
    }

    render()
    {
        var visible = {
            display: (1==1) ? 'block' : 'none'
        }

        return (
            <div>
                <section className="header">
                    <h1>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.header')}
                        <div className="control-bar text-right pull-right">
                            <Button onClick={ () => this.props.gotoStart()}>
                                <i className="fa fa-angle-left"/>
                                &nbsp;&nbsp;{this.context.i18n.getMessage('ServiceConfigFlow.Einvoice.backToTypeSelection')}
                            </Button>
                        </div>
                    </h1>
                </section>

                <div className="container">
                    <div className="row">
                        <section>
                            <div className="wizard">
                                <div className="wizard-inner">
                                    <Tab.Container activeKey={ this.state.currentTab } onSelect={ currentTab => this.setState({ currentTab }) } id="stepsContainer">
                                        <Row className="clearfix">
                                            <EInvoiceNav
                                                currentTab={this.state.currentTab} />
                                            <EInvoiceTabContent
                                                setCurrentTab = { (tabNo) => this.setCurrentTab(tabNo) }
                                                approveOcTc = { (tabNo) => this.approveOcTc(tabNo) }
                                                approveCustomerTc = { (tabNo) => this.approveCustomerTC(tabNo) }
                                                finalApprove = { () => this.finalApprove() }
                                                voucher = {this.props.voucher}
                                                inChannelConfig={this.props.inChannelConfig} />
                                        </Row>
                                    </Tab.Container>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        )
    }
}


class EInvoiceNav extends React.Component {
    render() {
        return (
            <Nav bsStyle="tabs">
                <MyDiv/>
                {/* see http://getbootstrap.com/components/ */}
                <NavItem eventKey={1}>
                    <span className="round-tab"><i className="glyphicon glyphicon-pencil"/></span>
                </NavItem>
                <NavItem eventKey={2} disabled={ this.props.currentTab < 2 }>
                    <span className="round-tab"><i className="glyphicon glyphicon-pencil"/></span>
                </NavItem>
                <NavItem eventKey={3} disabled={ this.props.currentTab < 3 }>
                    <span className="round-tab"><i className="glyphicon glyphicon-ok"/></span>
                </NavItem>
            </Nav>
        );
    }
}


class EInvoiceTabContent extends React.Component {
    render() {
        return (
            <Tab.Content>
                <Tab.Pane eventKey={1}>
                    <ServiceConfigFlow1
                        onNext={ () => { this.props.approveOcTc(2); }}
                        voucher = {this.props.voucher}
                        inChannelConfig={this.props.inChannelConfig}
                    />
                </Tab.Pane>
                <Tab.Pane eventKey={2}>
                    <ServiceConfigFlow2
                        onNext={ () => { this.props.approveCustomerTc(3) }}
                        onPrevious={ () => this.props.setCurrentTab(1) }
                        voucher = {this.props.voucher}
                        inChannelConfig={this.props.inChannelConfig}/>
                </Tab.Pane>
                <Tab.Pane eventKey={3}>
                    <ServiceConfigFlow3
                        onNext={ () => { this.props.finalApprove() } }
                        onPrevious={ () => this.props.setCurrentTab(2) }
                        voucher = {this.props.voucher}
                        inChannelConfig={this.props.inChannelConfig}
                    />
                </Tab.Pane>
            </Tab.Content>
        );
    }
}

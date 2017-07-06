import React from 'react';
import { Button, Nav, NavItem, Tab, Row } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';

import ServiceConfigFlow1 from './ServiceConfigFlow1';
import ServiceConfigFlow2 from '../common/ServiceConfigFlowTaCCustomer.js';
import ServiceConfigFlow3 from './ServiceConfigFlow3';

import InChannelConfig from '../../api/InChannelConfig.js';
import InChannelContract from '../../api/InChannelContract.js';


// A workaround to prevent a browser warning about unknown properties 'active', 'activeKey' and 'activeHref'
// in DIV element.
const MyDiv = () =>
{
    return <div className="connecting-line"/>;
};



export default class ServiceConfigFlow extends React.Component
{
    static propTypes = {
        currentTab : React.PropTypes.number,
        lastValidTab : React.PropTypes.number,
        inputType: React.PropTypes.string
    };

    static defaultProps = {
        currentTab : 1,
        lastValidTab : 1,
        inputType: null
    };

    constructor(props)
    {
        super(props);

        this.state = {
            currentTab : this.props.currentTab,
            lastValidTab : this.props.lastValidTab,
            inputType: this.props.inputType
        };
    }


    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };

    ////////////////////////////////////////
    // Events
    ////////////////////////////////////////
    setApprovedOcTc = (supplierId) => {
        return InChannelConfig.update(supplierId, {'status':'approved'});
    }

    setApprovedCustomerTc = () => {
        var customerId = this.props.voucher.customerId;
        var supplierId = this.props.voucher.supplierId;

console.log("** customerId: ", customerId);

        return new Promise((resolve, reject) => {
            InChannelConfig.get(supplierId)
            .then((data) => resolve(data))
            .catch((e) => {
console.log("*** eror: ", e);
                InChannelConfig.add(supplierId, 'paper', this.props.voucher.voucherId)
                .then((data) => resolve(data))
            })
        })
        .then((data) => {
console.log("InChannelConfig found: ", data);
            return InChannelContract.add(customerId, supplierId, 'paper', this.props.voucher.voucherId, 'approved')
            .catch((e) => {
                return InChannelContract.update(customerId, supplierId, 'paper', 'approved');
            })
        })
        .catch((e) => {
            console.log("Error appeared: ", e);
            return Promise.reject();
        })
    }


    finalApprove = () => {
        let supplierId = this.props.voucher.supplierId;
console.log(" ---- 1. finalApprove");
        return ajax.put('/einvoice-send/api/config/inchannels/' + supplierId + '/finish')
            .promise()
        .then(() => {
console.log(" ---- 2. finalApprove");
            this.props.finalizeFlow();
        })
        .catch((e) => {
            alert ("The forwarding to the Invoice mapping team did not succeed. Please retry.")
        })
    }





    setCurrentTab = (tabNo) => {
        this.setState({ currentTab : tabNo });
    }

    approveOcTc = (tabNo) => {
        this.setApprovedOcTc(this.props.voucher.supplierId)
        .then(() => this.setCurrentTab(tabNo));
    }

    approveCustomerTC = (tabNo) => {
        this.setApprovedCustomerTc()
        .then(() => this.setCurrentTab(tabNo));
    }




    render()
    {
        var visible = {
            display: (1==1) ? 'block' : 'none'
        }

        return (
            <div style={{ minHeight: '100vh' }}>
                <section className="content" style={{ overflow: 'visible' }}>
                    <div className="content-wrap">
                        <div className="container">
                            <section className="header">
                                <h1>
                                    {this.context.i18n.getMessage('ServiceConfigFlow.header')}
                                    <div className="control-bar text-right pull-right">
                                        <Button onClick={ () => this.props.gotoStart()}>
                                            <i className="fa fa-angle-left"/>
                                            &nbsp;&nbsp;{this.context.i18n.getMessage('ServiceConfigFlow.backToTypeSelection')}
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
                                                        <PaperNav
                                                            currentTab={this.state.currentTab}
                                                            customerTermsAndConditions={this.props.customerTermsAndConditions} />
                                                        <PaperTabContent
                                                            setCurrentTab = { (tabNo) => this.setCurrentTab(tabNo) }
                                                            approveOcTc = { (tabNo) => this.approveOcTc(tabNo) }
                                                            approveCustomerTc = { (tabNo) => this.approveCustomerTC(tabNo) }
                                                            finalApprove = { () => this.finalApprove() }
                                                            voucher = {this.props.voucher}
                                                            customerTermsAndConditions={this.props.customerTermsAndConditions}/>
                                                    </Row>
                                                </Tab.Container>
                                            </div>
                                        </div>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        )
    }
}


class PaperNav extends React.Component {
    render() {
        if (this.props.customerTermsAndConditions) {
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
        else {
            return (
                <Nav bsStyle="tabs">
                    <MyDiv/>
                    {/* see http://getbootstrap.com/components/ */}
                    <NavItem eventKey={1}>
                        <span className="round-tab"><i className="glyphicon glyphicon-pencil"/></span>
                    </NavItem>
                    <NavItem eventKey={2} disabled={ this.props.currentTab < 2 }>
                        <span className="round-tab"><i className="glyphicon glyphicon-ok"/></span>
                    </NavItem>
                </Nav>
            );
        }
    }
}


class PaperTabContent extends React.Component {
    render() {
        if (this.props.customerTermsAndConditions) {
            return (
                <Tab.Content>
                    <Tab.Pane eventKey={1}>
                        <ServiceConfigFlow1
                            onNext={ () => { this.props.approveOcTc(2); }}
                            voucher = {this.props.voucher}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey={2}>
                        <ServiceConfigFlow2
                            onNext={ () => { this.props.approveCustomerTc(3); }}
                            onPrevious={ () => this.props.setCurrentTab(1) }
                            voucher = {this.props.voucher}
                            customerTermsAndConditions = {this.props.customerTermsAndConditions}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey={3}>
                        <ServiceConfigFlow3
                            onNext={ () => { this.props.finalApprove() } }
                            onPrevious={ () => this.props.setCurrentTab(2) }
                            voucher = {this.props.voucher}/>
                    </Tab.Pane>
                </Tab.Content>
            );
        }
        else {
            return (
                <Tab.Content>
                    <Tab.Pane eventKey={1} disabled="disabled">
                        <ServiceConfigFlow1
                            onNext={ () => { this.props.approveOcTc(2); }}
                            voucher = {this.props.voucher}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey={2}>
                        <ServiceConfigFlow3
                            onNext={ () => { this.props.finalApprove() } }
                            onPrevious={ () => this.props.setCurrentTab(1) }
                            voucher = {this.props.voucher}/>
                    </Tab.Pane>
                </Tab.Content>
            );
        }
    }
}

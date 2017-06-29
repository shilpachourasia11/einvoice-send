import React from 'react';
import { Button, Nav, NavItem, Tab, Row } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';
import ServiceConfigFlow1 from '../ServiceConfigFlow1'
import ServiceConfigFlow2 from '../../common/ServiceConfigFlowTaCCustomer'
import ServiceConfigFlow3 from '../ServiceConfigFlow3'

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

    ///////////////////////////////////////////////
    // Webservice calls
    ///////////////////////////////////////////////

    //
    // InChannelConfig
    //
    getInChannelConfig = () =>
    {
        return ajax.get('/einvoice-send/api/config/inchannel')  // !!! /current
            .set('Content-Type', 'application/json')
            .promise();
    }

    addInChannelConfig = () =>
    {
console.log("++ addInChannelConfig -> paper/new");
        return ajax.post('/einvoice-send/api/config/inchannel')  // !!! /current
            .set('Content-Type', 'application/json')
            .send({
                inputType : 'paper',
                status: 'new'
            })
            .promise();
    }

    updateInChannelConfig = (values) => {
console.log("++ updateInChannelConfig -> values: ", values);
        return ajax.put('/einvoice-send/api/config/inchannel')  // !!! /current
            .set('Content-Type', 'application/json')
            .send(values).promise();
    }

    //
    // InChannelContract
    //
    getInChannelContract = (customerId) => {
console.log("++ getInChannelContract -> customerId: ", customerId);
        return ajax.get('/einvoice-send/api/config/inchannelcontract/' + customerId)
            .set('Content-Type', 'application/json')   // ??? really needed?
            .promise();
    }

    addInChannelContract = (customerId, status) => {
console.log("++ addInChannelContract -> customerId =" + customerId + ", status = " + status);
        status = status || 'new';
        return ajax.post('/einvoice-send/api/config/inchannelcontract')
            .set('Content-Type', 'application/json')
            .send({
                customerId : customerId,
                inputType : 'paper',
                status : status
            })
            .promise();
    }

    updateInChannelContract = (customerId, status) => {
console.log("++ updateInChannelContract -> customerId / status: ", customerId, status);
        return ajax.put('/einvoice-send/api/config/inchannelcontract')
            .set('Content-Type', 'application/json')
            .send({
                customerId : customerId,
                inputType : 'paper',
                status : status
            })
            .promise();
    }


    ////////////////////////////////////////
    // Events
    ////////////////////////////////////////
    setApprovedOcTc = () => {
        return this.updateInChannelConfig({'status':'approvedTC'});
    }

    setApprovedCustomerTc = () => {
        // this.updateInChannelConfig({'status':'approvedCustomerTc'});  // dummy - remove!!!

        var customerId = this.props.voucher.customerId;

console.log("** customerId: ", customerId);

        return new Promise((resolve, reject) => {
            this.getInChannelConfig(customerId)
            .then((data) => resolve(data))
            .catch((e) => {
console.log("*** eror: ", e);
                this.addInChannelConfig(customerId)
                .then((data) => resolve(data))
            })
        })
        .then((data) => {
console.log("InchannelConfig found: ", data);
            return this.addInChannelContract(customerId, 'approved')
            .catch((e) => {
                return this.updateInChannelContract(customerId, 'approved');
            })
        })
        .catch((e) => {
            console.log("Error appeared: ", e);
            return Promise.reject();
        })
    }

    finalApprove = () => {
        return ajax.get('/api/config/inchannel/approved')
            .promise()
        .then(() => {
            this.props.finalizeFlow();
        });
    }

    setCurrentTab = (tabNo) => {
        this.setState({ currentTab : tabNo });
    }

    approveOcTc = (tabNo) => {
        this.setApprovedOcTc()
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
                                    Service Configuration Flow
                                    <div className="control-bar text-right pull-right">
                                        <Button onClick={ () => this.props.gotoStart()}>
                                            <i className="fa fa-angle-left"/>
                                            &nbsp;&nbsp;Back to Type Selection
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

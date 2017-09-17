import React from 'react';
import { Button, Nav, NavItem, Tab, Row } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';

import PdfStep1 from './Step1.js';
import PdfStep2 from './Step2.js';
// import PdfStep3 from './Step3.js';
import PdfStep4 from './Step4.js';


import InChannelConfig from '../../../api/InChannelConfig.js';
import InChannelContract from '../../../api/InChannelContract.js';


// A workaround to prevent a browser warning about unknown properties 'active', 'activeKey' and 'activeHref'
// in DIV element.
const MyDiv = () =>
{
    return <div className="connecting-line"/>;
};


export default class PdfMain extends React.Component
{
    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };

    static propTypes = {
        currentTab : React.PropTypes.number,
        lastValidTab : React.PropTypes.number,  // ???
        gotoStart : React.PropTypes.func,
        gotoHome : React.PropTypes.func
    };

    static defaultProps = {
        currentTab : 1,
        lastValidTab : 1  // ???
    };

    constructor(props)
    {
        super(props);

        this.state = {
            currentTab : this.props.currentTab,
            lastValidTab : this.props.lastValidTab,  // ???
            user : {},
            voucher : {},
            customer : {
                customerId : "",
                customerName : ""
            },
            inChannelConfig : {}  // ???
        };
    }


    componentDidMount()
    {
        return this.getUserData().then(userData =>
        {
            console.log("ICC/pdf 1. User: ", userData);
            if (userData.supplierid) { userData.supplierId = userData.supplierid; }
            this.setState({ user : userData });
            return this.getVoucher(userData.supplierid);
        })
        .then(voucher =>
        {
            console.log("ICC/pdf 2. Voucher: ", voucher);
            this.setState({ voucher : voucher });

            return this.getCustomer(voucher.customerId);
        })
        .then(customer =>
        {
            console.log("ICC/pdf 3. Customer: ", customer);
            customer.id = this.state.voucher.customerId;    // ????
            if (!customer.customerName) customer.customerName = customer.customerId;
            this.setState({ customer : customer });
            return Promise.resolve(); // ???
        })
        .then(() => {
            return this.loadInChannelConfig(this.state.voucher.supplierId, "pdf");
            // return this.getInChannelConfig(this.state.voucher.supplierId, "pdf")
        })
        .then(icc => {
            console.log("ICC/pdf 4. InChannelConfig: ", icc.body);
            this.setState({ inChannelConfig : icc.body });

            return InChannelContract.get(this.state.voucher.supplierId, this.state.voucher.customerId)
        })
        .then((contract) => {
            console.log("ICC/pdf 5. Contract: ", contract);
            this.setState({ inChannelContract : contract.body });
        })
        .catch((e) =>  {
            console.log("Error determined when collecting data: ", e);
            // return new Promise.resolve();
        });
    }

    getUserData()
    {
        return ajax.get('/auth/userdata').then(res => JSON.parse(res.text));
    }

    getVoucher(supplierId)
    {
        return ajax.get('/einvoice-send/api/config/vouchers/' + supplierId)
            .set('Content-Type', 'application/json')
            .promise()
        .then(res => JSON.parse(res.text));
    }

    getCustomer = (customerId) => {
        return ajax.get('/einvoice-send/api/customers/' + customerId)
        .then((result) => {
            return JSON.parse(result.text);
        })
        .catch((e) =>  {
            console.log("Error - Did not receive details about customer with Id: " + customerId + " - error: ", e);
            return new Promise.resolve();
        });
    }

    getInChannelConfig(supplierId) {
        return ajax.get('/einvoice-send/api/config/inchannels/' + supplierId)
            .set('Content-Type', 'application/json')
            .promise()
        .then ((config) => {
            return config.body;
        })
    }
    loadInChannelConfig() {
        let supplierId = this.state.voucher.supplierId;

        let obj = {
            inputType: "pdf",
            voucherId: this.state.voucher.id,
            status: "new"
        };

        return this.getInChannelConfig(supplierId)
        .then(icc => {
console.log("+++ icc-state: ", icc);
            // TODO: set status of InChannelConfig only when activated by the user!

            obj.status = InChannelConfig.getNextStatus(icc && icc.status, InChannelConfig.status.new);
console.log("+++ update - obj: ", obj);
            // TODO: Return res.body
            return InChannelConfig.update(supplierId, obj);
        })
        .catch((e) => {
console.log("+++ insert - obj: ", obj);
            // TODO: Return res.body
            return InChannelConfig.add(supplierId, obj)
        });
    }

    getInChannelContract(supplierId, customerId) {
        return ajax.get('/einvoice-send/api/config/inchannels/' + supplierId)
            .set('Content-Type', 'application/json')
            .promise()
        .then ((config) => {
            return config.body;
        })
    }



    /////////////////////////////////////////////////////////
    // Events
    /////////////////////////////////////////////////////////

    setCurrentTab = (tabNo) => {
        this.setState({ currentTab : tabNo });
    }

    setConfig = (tabNo, config) => {
        console.log("Setting Config: ", tabNo, config);

        this.setCurrentTab(tabNo);
    }

    setXConfig = (tabNo, xConfig) => {
console.log("Setting xConfig: ", xConfig);
console.log("     with config: ", this.state.inChannelConfig);

        // TODO: Only update of xConfig! To avoid that Config.type changes before the user pressed "activate"

        // ??? What is the correct status to use? Shall we adjust it here???
        let currentStatus = this.state.inChannelConfig && this.state.inChannelConfig.status;
        xConfig.status = InChannelConfig.getNextStatus(currentStatus, xConfig.status);

        let  icc = InChannelConfig.update(this.state.voucher.supplierId, xConfig);
        console.log("New icc: ", icc);

        this.setCurrentTab(tabNo);
    }

    approveCustomerTaC = (tabNo) => {
        this.setApprovedCustomerTc()
        .then(() => {
            this.setCurrentTab(tabNo);
        });
    }
    setApprovedCustomerTc = () => {
        let supplierId = this.state.inChannelConfig && this.state.inChannelConfig.supplierId;
        let customerId = this.state.customer.id;
        let voucherId = this.state.voucher && this.state.voucher.id;

        let obj = {
            customerId: customerId,
            inputType: InChannelConfig.types.pdf,
            voucherId: voucherId,
            status: InChannelContract.status.approved
        }

        return this.insertUpdateContract(supplierId, customerId, obj)  // TODO one method
        .then(contract => {
            this.setState({ inChannelContract : contract });
            return contract;
        })
    }
    insertUpdateContract = (supplierId, customerId, obj) => {
        return InChannelContract.get(supplierId, customerId)
        .then((contract) => {
            return InChannelContract.update(supplierId, customerId, obj);
        })
        .catch((e) => {
            return InChannelContract.add(supplierId, obj);
        })
    }

    activate = () => {
        InChannelConfig.activate(this.state.inChannelConfig && this.state.inChannelConfig.supplierId)
        .then(() => {
            this.props.gotoHome();
        })
        .catch((e) => {
            console.log("Error appeared: ", e);
            alert ("The forwarding to the Invoice mapping team did not succeed. Please retry.")
        })
    }



    render()
    {
        // var visible = {
        //     display: (1==1) ? 'block' : 'none'
        // }

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
                                                        <PdfNav
                                                            currentTab={this.state.currentTab}
                                                        />
                                                        <PdfTabContent
                                                            setCurrentTab = { (tabNo) => this.setCurrentTab(tabNo) }
                                                            setXConfig = { (tabNo, xConfig) => this.setXConfig(tabNo, xConfig) }
                                                            approveCustomerTaC = { (tabNo) => this.approveCustomerTaC(tabNo) }
                                                            activate = { () => this.activate() }
                                                            voucher = {this.state.voucher}
                                                            customer = {this.state.customer}
                                                            inChannelConfig={this.state.inChannelConfig}
                                                            inChannelContract={this.state.inChannelContract}
                                                            user={this.state.user}
                                                        />
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


class PdfNav extends React.Component {
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
                {/* 2017-07-97 nc: On wish of Matts, we shall deactivate the PDF upload ui for now. Reason: No usage as long as there is no recipient for it
                <NavItem eventKey={3} disabled={ this.props.currentTab < 3 }>
                    <span className="round-tab"><i className="glyphicon glyphicon-search"/></span>
                </NavItem>
                <NavItem eventKey={4} disabled={ this.props.currentTab < 4 }>
                    <span className="round-tab"><i className="glyphicon glyphicon-ok"/></span>
                </NavItem>
                */}
                <NavItem eventKey={4} disabled={ this.props.currentTab < 3 }>
                    <span className="round-tab"><i className="glyphicon glyphicon-ok"/></span>
                </NavItem>
            </Nav>
        );
    }
}


class PdfTabContent extends React.Component {
    render() {
        return (
            <Tab.Content>
                <Tab.Pane eventKey={1}>
                    <PdfStep1
                        onNext={ (email) => { this.props.setXConfig(2, {rejectionEmail: email, status: InChannelConfig.status.approved}); }}
                        voucher = {this.props.voucher}
                        customer = {this.props.customer}
                        inChannelConfig={this.props.inChannelConfig}
                    />
                </Tab.Pane>
                <Tab.Pane eventKey={2}>
                    <PdfStep2
                        onNext={ () => this.props.approveCustomerTaC(4) }
                        onPrevious={ () => this.props.setCurrentTab(1) }
                        voucher = {this.props.voucher}
                        customer = {this.props.customer}
                        inChannelConfig={this.props.inChannelConfig}
                        inChannelContract={this.props.inChannelContract}
                        user={this.props.user}
                    />
                </Tab.Pane>
                {/* 2017-07-97 nc: On wish of Matts, we shall deactivate the PDF upload ui for now. Reason: No usage as long as there is no recipient for it
                <Tab.Pane eventKey={3}>
                    <PdfStep3
                        onNext={ () => { this.props.setCurrentTab(4) } }
                        onPrevious={ () => this.props.setCurrentTab(2) }
                        voucher = {this.props.voucher}
                        customer = {this.props.customer}
                    />
                </Tab.Pane>
                */}
                <Tab.Pane eventKey={4}>
                    <PdfStep4
                        onNext={ () => { this.props.activate() } }
                        onPrevious={ () => this.props.setCurrentTab(2) }
                        voucher = {this.props.voucher}
                        customer = {this.props.customer}
                        inChannelConfig={this.props.inChannelConfig}
                    />
                </Tab.Pane>
            </Tab.Content>
        );
    }
}

import React from 'react';
import { Button, Nav, NavItem, Tab, Row } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';
import ServiceConfigFlow1 from '../../common/ServiceConfigFlowTaCOC'
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
        cancelWorkflow : React.PropTypes.func,
        inputType: React.PropTypes.string
    };

    static defaultProps = {
        currentTab : 1,
        lastValidTab : 1,
        cancelWorkflow : () => { alert('Canceled!'); },
        inputType: null
    };

    constructor(props)
    {
        super(props);

        this.state = {
            currentTab : this.props.currentTab,
            lastValidTab : this.props.lastValidTab,
            cancelWorkflow : this.props.cancelWorkflow,
            inputType: this.props.inputType
        };

        this.getInChannelConfig().catch(e => this.addInChannelConfig());
    }

    getInChannelConfig = () =>
    {
        return ajax.get('/einvoice-send/api/config/inchannel')  // !!! /current
            .set('Content-Type', 'application/json')
            .promise();
    }

    addInChannelConfig = () =>
    {
        return ajax.post('/einvoice-send/api/config/inchannel')  // !!! /current
            .set('Content-Type', 'application/json')
            .send({
                inputType : 'paper',
                status: 'new'
            })
            .promise();
    }

    updateInChannelConfig = (values) => {
/*
        var values = {
            'billingModelId': 'cheap',
            'inputType': 'einvoice',
            'status': 'active'
        }

        return ajax.put('/einvoice-send/api/config/inchannel')  // !!! /current
            .set('Content-Type', 'application/json')
            .send(values).promise().then(() => window.location = '/bnp');
*/
        return ajax.put('/einvoice-send/api/config/inchannel')  // !!! /current
            .set('Content-Type', 'application/json')
            .send(values).promise();
    }


    getInChannelContract = (customerId) => {
        return ajax.get('/einvoice-send/api/config/inchannelcontract/' + customerId)
            .set('Content-Type', 'application/json')   // ??? really needed?
            .promise();
    }
    addInChannelContract = (customerId) => {
        return ajax.post('/einvoice-send/api/config/inchannelcontract')
            .set('Content-Type', 'application/json')
            .send({
                customerId : customerId,
                inputType : 'paper',
                status : 'new'
            })
            .promise();
    }
    updateInChannelContract = (customerId, values) => {
        return ajax.put('/einvoice-send/api/config/inchannelcontract')
            .set('Content-Type', 'application/json')
            .send(Object.assign({}, values, {customerId:customerId}))
            .promise();
    }


    approvedOcTc = () => {
        this.updateInChannelConfig({'status':'approvedTC'});
    }

    approvedCustomerTc = () => {
        // this.updateInChannelConfig({'status':'approvedCustomerTc'});  // dummy - remove!!!

        var customerId = 'OC';     // ??? how to determine? - implcit SupplierId, explicit CustomerId

        return new Promise((resolve, reject) => {
            this.getInChannelContract()
            .then(() => resolve())
            .catch((e) => {
                this.addInChannelConfig(customerId)
                .then(() => resolve())
            })
        })
        .then(() => {
            this.updateInChannelContract({status:'approved'});
        });
    }

    finalApprove = () => {
        return ajax.get('/api/config/inchannel/approved')
            .promise()
        .then(() => {
            this.props.finalizeFlow();
        });
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
                                                        <Nav bsStyle="tabs">
                                                            <MyDiv/>
                                                            {/* see http://getbootstrap.com/components/ */}
                                                            <NavItem eventKey={1}>
                                                                <span className="round-tab"><i className="glyphicon glyphicon-pencil"/></span>
                                                            </NavItem>
                                                            <NavItem eventKey={2} disabled={ this.state.currentTab < 2 }>
                                                                <span className="round-tab"><i className="glyphicon glyphicon-pencil"/></span>
                                                            </NavItem>
                                                            <NavItem eventKey={3} disabled={ this.state.currentTab < 3 }>
                                                                <span className="round-tab"><i className="glyphicon glyphicon-ok"/></span>
                                                            </NavItem>
                                                        </Nav>
                                                        <Tab.Content>
                                                            <Tab.Pane eventKey={1} disabled="disabled">
                                                                <ServiceConfigFlow1
                                                                    onNext={ () => {this.approvedOcTc(); this.setState({ currentTab: 2 });}}
                                                                    onPrevious={ () => this.props.cancelWorkflow() }
                                                                    voucher = {this.props.voucher}/>
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey={2}>
                                                                <ServiceConfigFlow2
                                                                    onNext={ () => {this.approvedCustomerTc(); this.setState({ currentTab: 3 }); }}
                                                                    onPrevious={ () => this.setState({ currentTab: 1 }) }
                                                                    voucher = {this.props.voucher}/>
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey={3}>
                                                                <ServiceConfigFlow3
                                                                    onNext={ () => { this.finalApprove() } }
                                                                    onPrevious={ () => this.setState({ currentTab: 2 }) }
                                                                    voucher = {this.props.voucher}/>
                                                            </Tab.Pane>
                                                        </Tab.Content>
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

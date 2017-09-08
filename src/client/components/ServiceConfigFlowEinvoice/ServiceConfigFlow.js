import React from 'react';
import { Button, Nav, NavItem, Tab, Row } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';

import ServiceConfigFlow1 from './ServiceConfigFlow1.js';
import ServiceConfigFlow3 from './ServiceConfigFlow3.js'

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

    setCurrentTab = (tabNo) => {
        this.setState({ currentTab : tabNo });
    }

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };



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
                                                        <EInvoiceNav
                                                            currentTab={this.state.currentTab}
                                                            customerTermsAndConditions={this.props.customerTermsAndConditions} />
                                                        <EInvoiceTabContent
                                                            setCurrentTab = { (tabNo) => this.setCurrentTab(tabNo) }
                                                            forward={this.props.gotoStart}
                                                            back={this.props.gotoStart}
                                                            voucher = {this.props.voucher}
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


class EInvoiceNav extends React.Component {
    render() {
            return (
                <Nav bsStyle="tabs">
                    <MyDiv/>
                    {/* see http://getbootstrap.com/components/ */}
                    <NavItem eventKey={1}>
                        <span className="round-tab"><i className="glyphicon glyphicon-pencil"/></span>
                    </NavItem>
                    <NavItem eventKey={2} disabled={ this.props.currentTab < 3 }>
                        <span className="round-tab"><i className="glyphicon glyphicon-ok"/></span>
                    </NavItem>
                </Nav>
            );
        }
}


class EInvoiceTabContent extends React.Component {
    render() {
        if (this.props.customerTermsAndConditions) {
            return (
                <Tab.Content>
                    <Tab.Pane eventKey={1}>
                        <ServiceConfigFlow1
                            goNext={()=>{this.props.setCurrentTab(2)}}
                            gotoStart={this.props.forward}
                            voucher = {this.props.voucher}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey={2}>
                        <ServiceConfigFlow3
                            gototStart = {this.props.forward} 
                            onPrevious = { () => {this.props.setCurrentTab(1)} }
                        />
                    </Tab.Pane>
                </Tab.Content>
            );
        }
        else {
            return (
                <Tab.Content>
                    <Tab.Pane eventKey={1} disabled="disabled">
                        <ServiceConfigFlow1
                            gotoStart={this.props.forward}
                            goNext={()=>{this.props.setCurrentTab(2)}}
                            voucher = {this.props.voucher}/>
                    </Tab.Pane>
                    <Tab.Pane eventKey={2}>
                        <ServiceConfigFlow3
                            gotoStart = {this.props.forward} 
                            onPrevious = { () => {this.props.setCurrentTab(1)} }
                        />
                    </Tab.Pane>
                </Tab.Content>
            );
        }
    }
}

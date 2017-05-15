import React from 'react';
import { Button, Nav, NavItem, Tab, Row } from 'react-bootstrap';
import ServiceConfigFlow1 from '../ServiceConfigFlow1'
import ServiceConfigFlow2 from '../ServiceConfigFlow2'
import ServiceConfigFlow3 from '../ServiceConfigFlow3'
import ServiceConfigFlow4 from '../ServiceConfigFlow4'
import ServiceConfigFlow5 from '../ServiceConfigFlow5'

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
        cancelWorkflow : React.PropTypes.func
    };

    static defaultProps = {
        currentTab : 1,
        lastValidTab : 1,
        cancelWorkflow : () => { alert('Canceled!'); }
    };

    constructor(props)
    {
        super(props);

        this.state = {
            currentTab : this.props.currentTab,
            lastValidTab : this.props.lastValidTab,
            cancelWorkflow : this.props.cancelWorkflow
        };
    }

    render()
    {
        return (
            <div style={{ minHeight: '100vh' }}>
                <section className="content" style={{ overflow: 'visible' }}>
                    <div className="content-wrap">
                        <div className="container">
                            <section className="header">
                                <h1>
                                    Service Configuration Flow
                                    <div className="control-bar text-right pull-right">
                                        <Button>
                                            <i className="fa fa-angle-left"/>
                                            &nbsp;&nbsp;Back to Registration
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
                                                            <NavItem eventKey={1}>
                                                                <span className="round-tab"><i className="glyphicon glyphicon-pencil"/></span>
                                                            </NavItem>
                                                            <NavItem eventKey={2} disabled={ this.state.currentTab < 2 }>
                                                                <span className="round-tab"><i className="glyphicon glyphicon-cog"/></span>
                                                            </NavItem>
                                                            <NavItem eventKey={3} disabled={ this.state.currentTab < 3 }>
                                                                <span className="round-tab"><i className="glyphicon glyphicon-search"/></span>
                                                            </NavItem>
                                                            <NavItem eventKey={4} disabled={ this.state.currentTab < 4 }>
                                                                <span className="round-tab"><i className="glyphicon glyphicon-credit-card"/></span>
                                                            </NavItem>
                                                            <NavItem eventKey={5} disabled={ this.state.currentTab < 5 }>
                                                                <span className="round-tab"><i className="glyphicon glyphicon-ok"/></span>
                                                            </NavItem>
                                                        </Nav>
                                                        <Tab.Content>
                                                            <Tab.Pane eventKey={1}>
                                                                <ServiceConfigFlow1
                                                                    onNext={ () => this.setState({ currentTab: 2, lastValidTab : 1 }) }
                                                                    onPrevious={ () => this.props.cancelWorkflow() } />
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey={2}>
                                                                <ServiceConfigFlow2
                                                                    onNext={ () => this.setState({ currentTab: 3, lastValidTab : 2 }) }
                                                                    onPrevious={ () => this.setState({ currentTab: 1 }) } />
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey={3}>
                                                                <ServiceConfigFlow3
                                                                    onNext={ () => this.setState({ currentTab: 4, lastValidTab : 3 }) }
                                                                    onPrevious={ () => this.setState({ currentTab: 2 }) } />
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey={4}>
                                                                <ServiceConfigFlow4
                                                                    onNext={ () => this.setState({ currentTab: 5, lastValidTab : 4 }) }
                                                                    onPrevious={ () => this.setState({ currentTab: 3 }) } />
                                                            </Tab.Pane>
                                                            <Tab.Pane eventKey={5}>
                                                                <ServiceConfigFlow5
                                                                    onNext={ () => window.location = '/bnp' }
                                                                    onPrevious={ () => this.setState({ currentTab: 4 }) } />
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

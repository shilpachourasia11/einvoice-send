import React from 'react';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import { I18nManager } from 'opuscapita-i18n';
import ServiceConfigFlowStart from './components/ServiceConfigFlowStart/ServiceConfigFlowStart.js'
import ServiceConfigFlowFramePDF from './components/ServiceConfigFlowPDF/ServiceConfigFlowFrame'
import ServiceConfigFlowFramePaper from './components/ServiceConfigFlowPaper/ServiceConfigFlowFrame'
import Layout from './layout.js';

export default class App extends React.Component
{
    static childContextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };

    constructor(props)
    {
        super(props);
        this.router = null;
        this.history = null
    }

    getChildContext()
    {
        return { i18n : new I18nManager('en', [ ]) };
    }

    navigate2Flow = (inputType) => {
        this.history.push("/" + inputType + "/1");
    }

    navigate2Start = () => {
        this.history.push("/");
    }

    finalizeFlow = () => {
        window.location.href = "/bnp";
    }

    render()
    {
        return (
            <Router history={ hashHistory } ref={el => {
                this.router = el.router;
                this.history = el.props.history;
            }}>
                <Route component={ Layout }>
                    <Route path="/" component={ () => {return (<ServiceConfigFlowStart openFlow={this.navigate2Flow} />)} } />)} } />

                    <Route path="/pdf/1" component={ () => (<ServiceConfigFlowFramePDF currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} />) } />
                    <Route path="/pdf/2" component={ () => (<ServiceConfigFlowFramePDF currentTab={2} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} />) } />
                    <Route path="/pdf/3" component={ () => (<ServiceConfigFlowFramePDF currentTab={3} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} />) } />
                    <Route path="/pdf/4" component={ () => (<ServiceConfigFlowFramePDF currentTab={4} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} />) } />

                    <Route path="/paper/1" component={ () => (<ServiceConfigFlowFramePaper currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} />) } />
                    <Route path="/paper/2" component={ () => (<ServiceConfigFlowFramePaper currentTab={2} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} />) } />
                    <Route path="/paper/3" component={ () => (<ServiceConfigFlowFramePaper currentTab={3} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} />) } />
                </Route>
            </Router>
        );
    }
}

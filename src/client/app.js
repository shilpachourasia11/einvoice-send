import React from 'react';
import ServiceConfigFlowFrame from './components/ServiceConfigFlowFrame'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import Layout from './layout.js';
//import browserHistory from 'react-router/lib/browserHistory';

export default class App extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return (
            <Router history={ hashHistory }>
                <Route component={ Layout }>
                    <Route path="/" component={ ServiceConfigFlowFrame } />
                    <Route path="/1" component={ () => (<ServiceConfigFlowFrame currentTab={1} />) } />
                    <Route path="/2" component={ () => (<ServiceConfigFlowFrame currentTab={2} />) } />
                    <Route path="/3" component={ () => (<ServiceConfigFlowFrame currentTab={3} />) } />
                    <Route path="/4" component={ () => (<ServiceConfigFlowFrame currentTab={4} />) } />
                    <Route path="/5" component={ () => (<ServiceConfigFlowFrame currentTab={5} />) } />
                </Route>
            </Router>
        );
    }
}

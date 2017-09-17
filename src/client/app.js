import React from 'react';
import { Router, Switch, Route, IndexRoute, Link, hashHistory } from 'react-router'
import ajax from 'superagent-bluebird-promise';
import Promise from 'bluebird';

import Layout from './layout.js';
import InChannelConfigStart from './components/InChannelConfigStart.js'

import ServiceConfigFlowFramePdf   from './components/ServiceConfigFlowPdf/ServiceConfigFlow.js'
import ServiceConfigFlowFramePaper from './components/ServiceConfigFlowPaper/ServiceConfigFlow.js'
import ServiceConfigFlowEInvoice   from './components/ServiceConfigFlowEinvoice/ServiceConfigFlow.js'

import PdfMain from './components/InChannelConfig/Pdf/PdfMain.js'


export default class App extends React.Component
{
    static propTypes = {
        user: React.PropTypes.object
    };

    static defaultProps = {
        user : null,
    };

    constructor(props)
    {
        super(props);

        this.history = null

        this.state = {
            user : this.props.user
        }
    }


    componentWillMount() {
/*
        this.loadUserData()
        .then((userData) => {
            this.setState({user : userData});
        })
*/
    }

    loadUserData() {
        return ajax.get('/auth/me')
            .promise()
        .then((result) => {
            return JSON.parse(result.text);
        });
    }

/*
                <Route exact path="/" component={InChannelConfig}/>
*/

    navigate2Home = () => {
        window.location.href = "/bnp/dashboard";
    }
    navigate2IccStart = () => {
        this.history.push("/icc");
    }
    navigate2Flow = (inputType) => {
        this.history.push("/icc/" + inputType);
    }


    render()
    {
        const Address = () => <h1>Hello from Test!</h1>
        const NotFound = () => <h1>Nothing found for this path!</h1>
        const ca = () => <h1>Component ca</h1>
        const cb = () => <h1>Component cb</h1>
        const aa = () => <h1>Component ca</h1>

        return (
          <div>
            <h1> Hi Norbert </h1>

            <Router history={ hashHistory } ref={el => {
                this.history = el && el.props && el.props.history;
            }}>

                <Route component={ Layout }>
                    <Route path="/" component={ () => {
                        return (
                            <div>
                                <h1>Test</h1>
                            </div>
                        )
                    }}/>


                    <Route path="/icc" component={ () => {
                        return (
                            <InChannelConfigStart
                                openFlow={this.navigate2Flow}
                            />
                        )
                    }} />
                    <Route path="/icc/einvoice" component={ () => (
                        <ServiceConfigFlowEInvoice currentTab={1} gotoStart={this.navigate2IccStart} gotoHome={this.navigate2Home} />
                    )} />
                    <Route path="/icc/pdf" component={ () => (
                        <PdfMain currentTab={1} gotoStart={this.navigate2IccStart} gotoHome={this.navigate2Home} />
                    )} />



                    <Route path="/icc2" component={InChannelConfigStart}/>

                    <Route path="/test" component={ () => {
                        return (
                            <div>
                                <h1>Test</h1>
                            </div>
                        )
                    }}/>

                    <Route path='/a' component={A}>
                        <Route path='/a/a' component={aa}/>
                        <Route path='/a/b' component={ab}/>
                    </Route>

                    <Route path='/c' component={C}>
                        <Route path='/c/a' component={ca}/>
                        <Route path='/c/b' component={cb}/>
                    </Route>

                    <Route path='/address' component={Address} />
                    <Route path='/huhu' component={Huhu} />
                    <Route path='*' component={NotFound} />


                    <Route path="/" component={() => {
                        <Switch>
                            <Route path="/test" component={() => {
                                <h3>Called test</h3>
                            }}/>
                            <Route path="/test/a" component={() => {
                                <h3>Called test/a</h3>
                            }}/>
                        </Switch>
                    }}/>

                </Route>
            </Router>
          </div>
        );
    }
}

class A extends React.Component {
    render() {
        return (
            <div>
                <h1>Rendering of Class A</h1>
                {this.props.children}
            </div>
        );
    }
}


class C extends React.Component {
    render() {
        return (
            <div>
                <h1>Rendering of Class c</h1>
                {this.props.children}
            </div>
        )
    }
}



class InChannelConfigTest extends React.Component {
    render () {
        return (
            <div>
                <b>This is ConfigTest!!!!</b>

                <Route path="/c/test" component={() => {
                    <h3>Called test</h3>
                }}/>
                <Route path="/c/test/a" component={() => {
                    <h3>Called test/a</h3>
                }}/>
            </div>
        );
    }
}

class ab extends React.Component {
    render () {
        return (
            <h1>Component ab</h1>
        );
    }
}




class Huhu extends React.Component {
    render () {
        return (
            <b>This is Huhu!!!!</b>
        );
    }
}

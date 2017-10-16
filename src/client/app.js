import React from 'react';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import ajax from 'superagent-bluebird-promise';
import Promise from 'bluebird';

import Layout from './layout.js';
import ServiceConfigFlowStart      from './components/ServiceConfigFlowStart.js'
import ServiceConfigFlowFramePdf   from './components/ServiceConfigFlowPdf/ServiceConfigFlow.js'
import ServiceConfigFlowFramePaper from './components/ServiceConfigFlowPaper/ServiceConfigFlow.js'
import ServiceConfigFlowEInvoice   from './components/ServiceConfigFlowEinvoice/ServiceConfigFlow.js'
import ServiceConfigFlowKeyIn   from './components/ServiceConfigFlowKeyIn/ServiceConfigFlow.js'

import KeyIn from './components/SalesInvoice/KeyIn.js'
import Test from './components/SalesInvoice/Test.js'
import TestInclude from './components/SalesInvoice/TestInclude.js'


export default class App extends React.Component
{
    static propTypes = {
        user: React.PropTypes.object,
        voucher: React.PropTypes.object,
        customerTermsAndConditions: React.PropTypes.string,
        inChannelConfig: React.PropTypes.object
    };

    static defaultProps = {
        user : null,
        voucher : {
            eInvoiceEnabled : false,
            pdfEnabled : false,
            keyInEnabled : false,
            paperEnabled : false
        },
        customerTermsAndConditions : null,
        inChannelConfig : null
    };

    constructor(props)
    {
        super(props);

        this.history = null

        this.state = {
            user : this.props.user,
            voucher : this.props.voucher,
            customerTermsAndConditions : this.props.customerTermsAndConditions,
            inChannelConfig: this.props.inChannelConfig
        }
    }


    componentWillMount() {
        this.loadUserData()
        .then((userData) => {
            this.setState({user : userData});
            this.loadVoucher();
            this.loadInChannelConfig();
        })
    }

    loadUserData() {
        return ajax.get('/auth/me')
            .promise()
        .then((result) => {
            return JSON.parse(result.text);
        });
    }

    // TOOD: Fetch language from context - not possible right now.
    getLocale() {
        return ajax.get('/auth/userdata')
        .then(res => JSON.parse(res.text))
        .then((userdata) => {
            return userdata.languageid;
        });
    }

    loadInChannelConfig() {
        ajax.get('/einvoice-send/api/config/inchannels/' + this.state.user.supplierId)
            .set('Content-Type', 'application/json')
            .promise()
        .then ((config) => {
            if (config) {
                this.setState({inChannelConfig: config.body});
            }
        })
        .catch((e) => {
            console.log("Error determined when fetching InChannelConfig for supplier " + this.state.user.supplierId + ": ", e);
        });
    }


    loadVoucher = () => {
        let supplierId = this.state.user.supplierId;
        this.getVoucher(supplierId)
        .then((result) => {    // .spread((voucher, response) => {

            let voucher = JSON.parse(result.text);
            // console.log("Voucher found: ", voucher);

            // How will evaluation of allowed input types and billings be determined???
            // Convention for now: Use boolen to enable or disable the different input types:
            voucher.eInvoiceEnabled = true; // !!! only for the supplier to confirm their intention
            voucher.pdfEnabled = true;
            voucher.keyInEnabled = true;
            voucher.paperEnabled = false;

            return this.getCustomer(voucher.customerId)
            .then((customer) => {
                voucher.customer = customer
                voucher.customerName = (customer && customer.customerName) || voucher.customerId;
            }).then(() => voucher);
        })
        .then((voucher) => {
            this.setState({voucher : voucher});

            return this.getLocale()
            .then((locale) => {
                if (!locale) {
                    locale = "";
                }
                return ajax.get('/blob/public/api/c_' + voucher.customerId + '/files/public/einvoice-send/TermsAndConditions_' + locale + '.html')
                .catch((e) => {
                    return ajax.get('/blob/public/api/c_' + voucher.customerId +  '/files/public/einvoice-send/TermsAndConditions.html')
                })
            })
            .then((response) => {
                console.log("Terms and Conditions: Found for customer " + voucher.customerId + ": ", response);
                this.setState({customerTermsAndConditions : response.text});
            })
            .catch((e) => {
                console.log("Terms and Conditions: No customer specific terms and conditions found!")
                return Promise.resolve();
            })
        })
        .catch((e) => {
            console.log("Error determined: ", e);

            // Setting voucher defaults - all options disabled:
            this.setState({
                voucher : {
                    eInvoiceEnabled : false,
                    pdfEnabled : false,
                    keyInEnabled : false,
                    paperEnabled : false
                },
                customerTermsAndConditions : null
            });
        })
    }

    getVoucher = (supplierId) => {
        return ajax.get('/einvoice-send/api/config/vouchers/' + supplierId)
            .set('Content-Type', 'application/json')
            .promise();
    }

    getCustomer = (customerId) => {
        return ajax.get('/einvoice-send/api/customers/' + customerId)
        .then((result) => {
            return JSON.parse(result.text);
        })
        .catch((e) =>  {
            console.log("Error - Did not receive details about customer with Id: " + customerId + " - error: ", e);
            return new Promise.resolve(null);
        });
    }


    ///////////////////////////////////////////
    // Events
    ///////////////////////////////////////////

    navigate2Flow = (inputType) => {
        return ajax.get('/einvoice-send/api/config/inchannels/' + this.state.user.supplierId)
            .set('Content-Type', 'application/json')
        .then ((config) => {
            if (config) {
                this.setState({inChannelConfig: config.body});
            }
            // it happend, that the wrong ICC was used for ui. So we have to wait. (Refactoring will follow!)
            this.history.push("/" + inputType);
        })
        .catch((e) => {
            console.log("Error determined when fetching InChannelConfig for supplier " + this.state.user.supplierId + ": ", e);
        });
    }

    navigate2Start = () => {
        this.loadInChannelConfig();
        this.history.push("/");
    }

    updateEinvoiceAndGotoStart = (intention = null) => {
        if (intention != null) {
            let config = this.state.inChannelConfig;
            if (config) {
                if (!config.EInvoiceChannelConfig) {
                    config.EInvoiceChannelConfig = {};
                }
                config.EInvoiceChannelConfig.intention = intention;
                this.setState({
                    inChannelConfig: config
                });
            }
            else {
                this.loadInChannelConfig();
            }
        }
        this.history.push("/");
    }

    updateKeyInAndGotoStart = (intention = null) => {
        if (intention != null) {
            let config = this.state.inChannelConfig;
            if (config) {
                if (!config.KeyInChannelConfig) {
                    config.KeyInChannelConfig = {};
                }
                config.KeyInChannelConfig.intention = intention;
                this.setState({
                    inChannelConfig: config
                });
            }
            else {
                this.loadInChannelConfig();
            }
        }
        this.history.push("/");
    }

    finalizeFlow = () => {
        window.location.href = "/bnp/dashboard";
    }

    render()
    {
        if (!this.state.user) {
            return null;
        }

        return (
            <Router history={ hashHistory } ref={el => {
                this.history = el && el.props && el.props.history;
            }}>
                <Route component={ Layout }>
                    <Route exact path="/" component={ () => {
                        return (
                            <ServiceConfigFlowStart
                                openFlow={this.navigate2Flow}
                                user={this.state.user}
                                voucher={this.state.voucher}
                                inChannelConfig={this.state.inChannelConfig}
                                loadVoucher={this.loadVoucher} />
                        )} } />


                    <Route path="/pdf" component={ () => (<ServiceConfigFlowFramePdf currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} inChannelConfig={this.state.inChannelConfig} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />

                    <Route path="/pdf/1" component={ () => (<ServiceConfigFlowFramePdf currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} inChannelConfig={this.state.inChannelConfig} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/pdf/2" component={ () => (<ServiceConfigFlowFramePdf currentTab={2} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} inChannelConfig={this.state.inChannelConfig} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/pdf/3" component={ () => (<ServiceConfigFlowFramePdf currentTab={3} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} inChannelConfig={this.state.inChannelConfig} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/pdf/4" component={ () => (<ServiceConfigFlowFramePdf currentTab={4} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} inChannelConfig={this.state.inChannelConfig} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />


                    <Route path="/paper" component={ () => (<ServiceConfigFlowFramePaper currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />

                    <Route path="/paper/1" component={ () => (<ServiceConfigFlowFramePaper currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/paper/2" component={ () => (<ServiceConfigFlowFramePaper currentTab={2} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/paper/3" component={ () => (<ServiceConfigFlowFramePaper currentTab={3} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />


                    <Route path="/einvoice" component={ () => (<ServiceConfigFlowEInvoice currentTab={1} gotoStart={this.updateEinvoiceAndGotoStart} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher}  inChannelConfig={this.state.inChannelConfig}  customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />

                    <Route path="/einvoice/1" component={ () => (<ServiceConfigFlowEInvoice currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} inChannelConfig={this.state.inChannelConfig} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/einvoice/2" component={ () => (<ServiceConfigFlowEInvoice currentTab={2} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} inChannelConfig={this.state.inChannelConfig} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/einvoice/3" component={ () => (<ServiceConfigFlowEInvoice currentTab={3} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} inChannelConfig={this.state.inChannelConfig} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />

                    <Route path="/keyin" component={ () => (<ServiceConfigFlowKeyIn currentTab={1} gotoStart={this.updateKeyInAndGotoStart} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher}  inChannelConfig={this.state.inChannelConfig}  customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />

                    <Route path="/keyin/1" component={ () => (<ServiceConfigFlowKeyIn currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} inChannelConfig={this.state.inChannelConfig} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/keyin/2" component={ () => (<ServiceConfigFlowKeyIn currentTab={2} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} inChannelConfig={this.state.inChannelConfig} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/keyin/3" component={ () => (<ServiceConfigFlowKeyIn currentTab={3} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} inChannelConfig={this.state.inChannelConfig} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />

                    
                    <Route path="/key-in" component={KeyIn}/>

                    <Route exact path="/test" component={Test}/>
                    <Route exact path="/test2" component={TestInclude}/>

                </Route>
            </Router>
        );
    }
}

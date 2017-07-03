import React from 'react';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import ajax from 'superagent-bluebird-promise';
import Promise from 'bluebird';

import ServiceConfigFlowStart      from './components/ServiceConfigFlowStart.js'
import ServiceConfigFlowFramePdf   from './components/ServiceConfigFlowPdf/ServiceConfigFlow.js'
import ServiceConfigFlowFramePaper from './components/ServiceConfigFlowPaper/ServiceConfigFlow.js'
import Layout from './layout.js';


export default class App extends React.Component
{
    static propTypes = {
        voucher: React.PropTypes.object,
        customerTermsAndConditions: React.PropTypes.string
    };

    static defaultProps = {
        voucher : {
            eInvoiceEnabled : false,
            pdfEnabled : false,
            supplierPortalEnabled : false,
            paperEnabled : false
        },
        customerTermsAndConditions : null
    };

    constructor(props)
    {
        super(props);

        this.history = null

        this.state = {
            voucher : this.props.voucher,
            customerTermsAndConditions : this.props.customerTermsAndConditions
        }

        console.log("--------------> ", this.props)
    }


    componentWillMount() {

        this.getVoucher()
        .then((result) => {    // .spread((voucher, response) => {

            let voucher = JSON.parse(result.text);
            console.log("--> app.js - received voucher: ", voucher);

            // How will evaluation of allowed input types and billings be determined???
            // Convention for now: Use boolen to enable or disable the different input types:
            voucher.eInvoiceEnabled = false; // !!! no flow ui available up to now
            voucher.pdfEnabled = true;
            voucher.supplierPortalEnabled = false; // !!! no flow ui available up to now
            voucher.paperEnabled = true;

            return this.getCustomer(voucher.customerId)
            .then((customer) => {
                voucher.customer = customer
                voucher.customerName = (customer && customer.customerName) || voucher.customerId;
            }).then(() => voucher);
        })
        .then((voucher) => {
            this.setState({voucher : voucher});

            return ajax.get('/einvoice-send/api/inchannel/termsandconditions/' + voucher.customerId)
                .set('Content-Type', 'application/json')
                .promise()
            .then((result) => {
                console.log("TermsAndConditions for customer " + voucher.customerId + ": ", result);
                this.setState({customerTermsAndConditions : result.text});
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
                    supplierPortalEnabled : false,
                    paperEnabled : false
                },
                customerTermsAndConditions : null
            });
        })
    }


    getVoucher = () => {
        return ajax.get('/einvoice-send/api/config/voucher/')
            .set('Content-Type', 'application/json')
            .promise();
    }

    getCustomer = (customerId) => {
        return ajax.get('/customers/customer/' + customerId)
            .set('Content-Type', 'application/json')
        .catch((e) =>  {
            console.log("Error - No customer with Id: " + customerId + " - error: ", e);
            return new Promise.resolve(null);
        });
    }


    ///////////////////////////////////////////
    // Events
    ///////////////////////////////////////////

    navigate2Flow = (inputType) => {
console.log(">> navigate2Flow is called!");
        // this.history.push("/" + inputType + "/1");
        this.history.push("/" + inputType);
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
                this.history = el && el.props && el.props.history;
            }}>
                <Route component={ Layout }>
                    <Route path="/" component={ () => {return (<ServiceConfigFlowStart openFlow={this.navigate2Flow} voucher={this.state.voucher} />)} } />)} } />

                    <Route path="/pdf" component={ () => (<ServiceConfigFlowFramePdf currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />

                    <Route path="/pdf/1" component={ () => (<ServiceConfigFlowFramePdf currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/pdf/2" component={ () => (<ServiceConfigFlowFramePdf currentTab={2} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/pdf/3" component={ () => (<ServiceConfigFlowFramePdf currentTab={3} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/pdf/4" component={ () => (<ServiceConfigFlowFramePdf currentTab={4} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />


                    <Route path="/paper" component={ () => (<ServiceConfigFlowFramePaper currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />

                    <Route path="/paper/1" component={ () => (<ServiceConfigFlowFramePaper currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/paper/2" component={ () => (<ServiceConfigFlowFramePaper currentTab={2} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                    <Route path="/paper/3" component={ () => (<ServiceConfigFlowFramePaper currentTab={3} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.state.voucher} customerTermsAndConditions={this.state.customerTermsAndConditions} />) } />
                </Route>
            </Router>
        );
    }
}

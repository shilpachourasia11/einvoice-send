import React from 'react';
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import { I18nManager } from 'opuscapita-i18n';
import ajax from 'superagent-bluebird-promise';
import Promise from 'bluebird';


import ServiceConfigFlowStart from './components/ServiceConfigFlowStart/ServiceConfigFlowStart.js'
import ServiceConfigFlowFramePDF from './components/ServiceConfigFlowPDF/ServiceConfigFlowFrame'
import ServiceConfigFlowFramePaper from './components/ServiceConfigFlowPaper/ServiceConfigFlowFrame'
import Layout from './layout.js';

export default class App extends React.Component
{
    static childContextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };

    static propTypes = {
        supplierId : React.PropTypes.string,
        customerId : React.PropTypes.string,
        voucherCode : React.PropTypes.string
    };

    static defaultProps = {
        supplierId : "ABC",      // req.opuscapita.userData('supplierId')  ???
        customerId : "oc"        // to be calculated with the voucherCode  ???
    };

    constructor(props)
    {
        super(props);

        this.history = null

        this.icc = {
            supplierId: this.props.supplierId || "ABC",  // req.opuscapita.userData('supplierId')
            customerId: this.props.customerId
        }

        console.log("--------------> ", this.props)
//         console.log("--------------> ", this.props.location.query.supplierId)
//         console.log("--------------> ", this.props.location.query.customerId)
    }


    componentWillMount() {
// console.log("-- componentWillMount is called");
        this.getVoucher()
        .then((result) => {    // .spread((voucher, response) => {
console.log("-- voucher result: ", result);
            this.voucher = JSON.parse(result.text);               // ???
            console.log("-- componentWillMount - Voucher: ", this.voucher);
        })
        .catch((e) => {
            // message: No Voucher was found for you.   ???
            console.log("Error: ", e);
        })
    }


    getChildContext()
    {
        return { i18n : new I18nManager('en', [ ]) };
    }


    getVoucher = () => {
        return ajax.get('/einvoice-send/api/config/voucher/')  // !!! ??? will search for one voucher depending on your assignment
            .set('Content-Type', 'application/json')
            .promise();
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
        console.log("props: ", this.props);    // ???
//        const query = this.props.location.query;
//        console.log("query.supplierId = ", query.supplierId);

        return (
            <Router history={ hashHistory } ref={el => {
                this.history = el.props.history;
            }}>
                <Route component={ Layout }>
                    <Route path="/" component={ () => {return (<ServiceConfigFlowStart openFlow={this.navigate2Flow} />)} } />)} } />

                    <Route path="/pdf/1" component={ () => (<ServiceConfigFlowFramePDF currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.voucher} />) } />
                    <Route path="/pdf/2" component={ () => (<ServiceConfigFlowFramePDF currentTab={2} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.voucher} />) } />
                    <Route path="/pdf/3" component={ () => (<ServiceConfigFlowFramePDF currentTab={3} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.voucher} />) } />
                    <Route path="/pdf/4" component={ () => (<ServiceConfigFlowFramePDF currentTab={4} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.voucher} />) } />

                    <Route path="/paper/1" component={ () => (<ServiceConfigFlowFramePaper currentTab={1} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.voucher} />) } />
                    <Route path="/paper/2" component={ () => (<ServiceConfigFlowFramePaper currentTab={2} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.voucher} />) } />
                    <Route path="/paper/3" component={ () => (<ServiceConfigFlowFramePaper currentTab={3} gotoStart={this.navigate2Start} finalizeFlow={this.finalizeFlow} voucher={this.voucher} />) } />
                </Route>
            </Router>
        );
    }
}

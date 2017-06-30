import React from 'react';
import { Button } from 'react-bootstrap';
//import browserHistory from 'react-router/lib/browserHistory';
import ajax from 'superagent-bluebird-promise';

export default class ServiceConfigFlow1 extends React.Component {

    static propTypes = {
        accepted : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        ocTermsAndConditions : React.PropTypes.string
    };

    static defaultProps = {
        accepted : false
    };

    constructor(props)
    {
        super(props)

        this.state = {
            accepted : this.props.accepted,
            ocTermsAndConditions : 'loading OpusCapita Terms and Conditions...'
        }
    }

    static contextTypes = {
        i18n : React.PropTypes.object.isRequired,
    };

//    componentDidMount() {
//      console.log(">>>> ServiceConfigFlow1 - props", this.props);
//    }

    getOcHtmlTermsAndConditions() {
        // TODO: Fetch text from Server
        // TODO: Language dependent determination of the terms and conditions
        return {__html: `
            In order to use our Service the paper invoices needs to be directed to the OpusCapita production
            facilities. A unique Customer ID per buyer unit is required. Every invoice must show correct
            invoicing address and with sufficient Customer ID in the address field. If correct buyer cannot
            be identified, a copy of paper invoice will be rejected and forward to the Customer via email.
            The unique Customer ID is mandatory data and must be found on the invoice. Without this data it
            cannot be guaranteed that the invoice can be transferred to the Customer system.
            Header/footer data has to be shown in the header/footer level and in understandable form i.e.
            header/footer information will not be searched in invoice specification level nor appendixes.
            Following header/footer data will be delivered in Service. If a mandatory field is missing necessary
            actions is shown in the table below.
            <br/>
            <br/>
            Prerequisites for receiving of paper documents for invoice digitizing (scanning)
            <ul/>
                <li>The default size for scanned documents is A4.</li>
                <li>Smaller documents (e.g. receipts) are scanned in their actual size or attached to an A4 sheet before scanning. </li>
                <li>The scanning resolution is 300 dpi</li>
                <li>Black-and-white image file </li>
                <li>Each invoice and all its attachments are scanned into a single file.</li>
                <li>All invoices are processed and scanned and appendixes that are part of an invoice transaction pass through the entire process along with the invoice. </li>
                <li>If the paper invoice and its appendixes exceeds 500 pages the invoice will be processed and its appendixes will not. </li>
                    <ul>
                        <li>In such case, OpusCapita add an informative letter to the scanned invoice, i.e. Paper invoice arrived with materials unsuitable for digitizing. </li>
                    </ul>
                <li>Invoices with formats larger than A4 but up to A3, and smaller than A5 may need manual operating actions in order to be processed. </li>
                <li>Documents other than invoices i.e. statements, as well as invoices that cannot be optically read due to reasons like torn, heavily damaged or unreadable documents and documents that exceed the size are forwarded to one Customer address </li>
                <li>Advertisements, customer magazines, pricelists, brochures, and invoice copies are eliminated from the process and destroyed.</li>
                <li>Parcels sent to the invoicing address will be returned to the Sender and all related cost will be charged to the Customer.</li>
                <li>If OpusCapita receives letters which are not addressed to the Customer they will be returned back to local mail provider. </li>
                <li>Credit invoices and copies of invoices (without receiving the original invoices) will be processed as an invoice. </li>
                <li>Payment reminders is rejected and returned to the Customer as non-valid document type</li>
            </ul>
            `
        };
    }


    render()
    {
        return (
            <div>
                <h3>{this.context.i18n.getMessage('congratulations')}</h3>
                <div>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Paper.subheader', {customer : this.props.voucher.customerName})}
                </div>

                <hr/>

                <div className="bs-callout bs-callout-info">
                    <div dangerouslySetInnerHTML={this.getOcHtmlTermsAndConditions()} />
                </div>

                <hr/>

                <div className="col-md-6">
                    <label className="oc-check">
                        <input type="checkbox" checked={ this.state.accepted } onChange={ e => this.setState({ accepted: e.target.checked }) }/>
                        <a href="#" onClick={e => { this.setState({ accepted: !this.state.accepted }); e.preventDefault(); }}>
                            {this.context.i18n.getMessage('ServiceConfigFlow.readOCTaC')}
                        </a>
                    </label>
                </div>

                <div className="form-submit text-right" style={{ marginTop: '80px' }}>
                    <Button bsStyle="primary" disabled={ !this.state.accepted } onClick={ () => this.props.onNext() }>
                        {this.context.i18n.getMessage('accept')}
                    </Button>
                </div>
            </div>
        )
    }
}

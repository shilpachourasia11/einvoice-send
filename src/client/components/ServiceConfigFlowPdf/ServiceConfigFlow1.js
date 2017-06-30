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
            Following prerequisites are required from sender unit for OpusCapita to process the invoices and must therefore be followed by the email invoice sender:
            <ul>
                <li>The email address must be entered into recipient “TO” field in the email message. Multiple email addresses are not supported in “TO”-field</li>
                <li>The Sender of the email invoice should not use a “no-reply” since they then not will receive possible error messages</li>
                <li>Only PDF- or TIFF-file attachments are accepted.
                    <ul>
                        <li>Supported and required PDF formats: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 and PDF/A-1, PDF/A-2, PDF/A-3</li>
                        <li>Supported and required TIFF formats: TIFF CCITT 4 Fax B&W (300 dpi)</li>
                    </ul>
                </li>
                <li>If an email contains other non-valid attachments (i.e. .docx) only PDF- and TIFF-file attachment will be processed and rest of the attachments will be ignored </li>
                <li>One attachment is one invoice. If one attachment includes several invoices, they are handled as one (the first one will be interpreted and verified</li>
                <li>If one invoice and its appendixes are in separate files, they are not handled as one invoice. The separate appendix is rejected</li>
                <li>One email can include up to 10 attachments</li>
                <li>Maximum size for one attachment is 10 Mb.</li>
                <li>Maximum layout size for an attachment is A3 (no minimum size limitation).</li>
                <li>Maximum page limit for one attachment (one invoice) is 500 pages.</li>
                <li>PDF files cannot be encrypted or password protected</li>
                <li>Fonts need to be included in the PDF if it contains text layouts</li>
                <li>If the invoice is first printed out on paper and then scanned before it is attached and sent by email to OpusCapita:</li>
                    <ul>
                        <li>The print quality should be, minimum 600 dpi</li>
                        <li>The color should be black-and-white</li>
                        <li>The chosen font should be easy to read, i.e. Arial</li>
                        <li>The scanning settings should be, minimum 300 dpi</li>
                        <li>The email shall follow standard protocols MIME 1.0/1.1 with RFC 5322, 2231 and 2045</li>
                    </ul>
                </li>
            </ul>
            <br/>
            <b>If above requirements are not met and the invoice cannot be processed it will be rejected.</b>
            <br/>
            <br/>
            Please be aware of; that the domain is dedicated only for Invoice Digitizing services. Anyone, who knows the correct email address, can send email invoices.
            The email body text including sender and receiver information is added to the invoice and is attached to all invoices in the specific email message and processed. The Service uses spam filtering.
            `
        };
    }


    render()
    {
        return (
            <div>
                <h3>{this.context.i18n.getMessage('congratulations')}</h3>
                <div>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Pdf.subheader', {customer : this.props.voucher.customerName})}
                </div>

                <hr/>

                <div className="bs-callout bs-callout-info">
                    <div>
                        {this.context.i18n.getMessage('ServiceConfigFlow.Pdf.intro', {customer : this.props.voucher.customerName})}
                    </div>
                    <br/>
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

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
        locale: React.PropTypes.string
    };

//    componentDidMount() {
//      console.log(">>>> ServiceConfigFlow1 - props", this.props);
//    }

    getOcHtmlTermsAndConditions() {
        // TODO: Fetch text from Server
        let enTuC = `
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
                <li>If the invoice is first printed out on paper and then scanned before it is attached and sent by email to OpusCapita:
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
            `;

        let deTuC = `
            Um Rechnungen in den Verarbeitungsprozess einstellen zu können, müssen folgende Anforderungen vom Versender für PDFs per E-Mail eingehalten werden:
            <ul>
                <li>Die E-Mail-Adresse muss im Empfänger-Feld (“TO”) der E-Mail-Adresse hinterlegt sein.
                    Mehr als eine E-Mail-Adresse wird im Empfänger-Feld nicht unterstützt.</li>
                <li>Der Sender der E-Mail-Rechnung sollte kein “no-reply” verwenden, damit mögliche Fehler bei der Versendung erhalten werden können.</li>
                <li>Aktzeptiert werden nur PDF- oder TIFF-Anhänge.
                    <ul>
                        <li>Unterstütze PDF-Formate: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7 und PDF/A-1, PDF/A-2, PDF/A-3</li>
                        <li>Unterstütze TIFF-Formate: TIFF CCITT 4 Fax B&W (300 dpi)</li>
                    </ul>
                </li>
                <li>Nur PDF- und TIFF-Anhänge werden unterstützt. Enthält die E-Mail weitere nicht-unterstütze
                    Anhänge (.docx, etc.), werden diese ignoriert.</li>
                <li>Ein valider Anhang entspricht einer Rechnung. Enthält ein Anhang mehrere Rechnungen, wird
                nur eine Rechnung angelegt - die erste Rechnung wird interpretiert und überprüft.</li>
                <li>Sind die Rechnung und Anlagen in mehrere Dateien aufgesplittet, findet keine Zusammenführung statt. Getrennte Anlagen werden aussortiert.</li>
                <li>Eine E-Mail darf bis zu 10 Anhänge enthalten</li>
                <li>Die Maximalgröße für einen Anhang beträgt 10Mb.</li>
                <li>Die maximale Layoutgröße für einen Anhang beträgt DIN A3 (ohne minimale Größenbeschränkung).
                <li>Die maximal Seitenanzahl je Attachment (= Rechnung) beträg 500 Seiten.</li>
                <li>Verschlüsselung oder Passwortschutz wird für PDF-Datien nicht unterstützt.</li>
                <li>Schriftsätze (Fonts) müssen im PDF mitgeliefert werden, so Text-Layout enthalten ist.</li>
                <li>Sollten Sie die Rechnung erst auf Papier ausdrucken, um Sie dann für die Versendung per E-Mail an OpusCapita einzuscannen:
                    <ul>
                        <li>Wählen Sie als Druckqualität mindestens 500 dpi</li>
                        <li>Drucken Sie in schwarz-weiß</li>
                        <li>Der ausgewählte Schriftsatz solle leicht zu lesen sein (z.B. Arial)</li>
                        <li>Das Scannen sollte mit mindestes 300 dpi erfolgen.</li>
                        <li>Die E-Mail sollte Standard-Protokollen, wie MIME 1.0/1.1 mit RFC 5322, 2231 und 2045 entsprechen.</li>
                    </ul>
                </li>
            </ul>
            <br/>
            <b>Sollten obige Anforderungen nicht eingehalten werden und somit die Rechnung nicht automatisiert zu verarbeiten sein, wird diese zurückgewiesen.</b>
            <br/>
            <br/>
            Bitte beachten Sie: Die E-Mail-Adresse ist fest der Rechnungsdigitalisierung zugeordnet. Jeder, dem diese E-Mail-Adresse bekannt ist, kann PDF-Rechnungen versenden.
            Der E-Mail-Text, inklusive Absender und Empfänger, wird der Rechnung bzw. den Rechnungen angehängt und durchläuft die Verarbeitung.
            Wir verwenden einen Spam-Filter.
            `;

        let str = "";
        if (this.context.locale == "de") {
            str = deTuC;
        }
        else {
            str = enTuC;
        }

        return {__html: str};
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
                        {this.context.i18n.getMessage('ServiceConfigFlow.Pdf.intro', {customer : this.props.voucher.customerName, customerId : this.props.voucher.customerId})}
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

import React from 'react';
import { Components } from '@opuscapita/service-base-ui';
import { Button } from 'react-bootstrap';
import ajax from 'superagent-bluebird-promise';
import translations from './i18n'

export default class ServiceConfigFlow1 extends Components.ContextComponent
{
    static propTypes = {
        accepted : React.PropTypes.bool,
        onNext : React.PropTypes.func.isRequired,
        ocTermsAndConditions : React.PropTypes.string
    };

    static defaultProps = {
        accepted : false
    };

    constructor(props, context)
    {
        super(props)

        context.i18n.register('ServiceConfigFlowPaper', translations);

        this.state = {
            accepted : this.props.accepted,
            ocTermsAndConditions : 'loading OpusCapita Terms and Conditions...'
        }
    }

    componentWillReceiveProps(nextProps)
    {
        this.props = nextProps;
        this.setState({ });
    }

//    componentDidMount() {
//      console.log(">>>> ServiceConfigFlow1 - props", this.props);
//    }

    getOcHtmlTermsAndConditions() {

        // let invoiceActionTable = '<img src="static/img/InvoiceActionTable.jpg">';
        let invoiceActionTable = `
            <table border="1" cellpadding="2" style="width:80%;margin-left:auto;margin-right:auto">
                <tr>
                    <th>Data/Value</th>
                    <th>Mandatory</th>
                    <th>Description</th>
                    <th>If value is missing</th>
                </tr>
                <tr>
                    <td>Customer ID</td>
                    <td>Yes</td>
                    <td>Identify buyer unit</td>
                    <td>Reject to customer</td>
                </tr>
                <tr>
                    <td>Invoice number</td>
                    <td></td>
                    <td></td>
                    <td>N/A</td>
                </tr>
                <tr>
                    <td>Invoice date</td>
                    <td></td>
                    <td>CCYYMMDD</td>
                    <td>Current date CCYYMMDD</td>
                </tr>
                <tr>
                    <td>Due date</td>
                    <td></td>
                    <td>CCYYMMDD</td>
                    <td>N/A</td>
                </tr>
                <tr>
                    <td>VAT amount</td>
                    <td></td>
                    <td>0.00</td>
                    <td>0.00</td>
                </tr>
                <tr>
                    <td>Total amount</td>
                    <td></td>
                    <td>0.00</td>
                    <td>0.00</td>
                </tr>
                <tr>
                    <td>Currency</td>
                    <td></td>
                    <td>ISO, on currency per invoice</td>
                    <td>Default based on coutry settings</td>
                </tr>
                <tr>
                    <td>Payment reference</td>
                    <td></td>
                    <td>I.e. OCR/KID/FIK</td>
                    <td>N/A</td>
                </tr>
                <tr>
                    <td>Supplier account ID</td>
                    <td></td>
                    <td>One value per invoice and same same type of value to be captured for all invoices, like
                        <ul>
                            <li>Bank account number (BBAN/IBAN)</li>
                            <li>Bankgiro</li>
                            <li>Plusgiro</li>
                        </ul>
                    </td>
                    <td>N/A</td>
                </tr>
                <tr>
                    <td>BIC (for IBAN accounts only)</td>
                    <td></td>
                    <td></td>
                    <td>N/A</td>
                </tr>
                <tr>
                    <td>Sender's VAT ID</td>
                    <td></td>
                    <td></td>
                    <td>N/A</td>
                </tr>
                <tr>
                    <td>Invoice Type</td>
                    <td></td>
                    <td>Debit(1), Credit(0)</td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>Sendes's name, supplier name</td>
                    <td></td>
                    <td>Only valid if OC is the receiving Customer system</td>
                    <td>N/A</td>
                </tr>
            </table>`;

        // TODO: Fetch text from Server
        let enTuC = `
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
            ` +
            invoiceActionTable +
            `
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
                <li>Documents other than invoices i.e. statements, as well as invoices that cannot be optically read due to reasons like torn, heavily damaged or unreadable documents and documents that exceed the size are forwarded to one Customer address.</li>
                <li>Advertisements, customer magazines, pricelists, brochures, and invoice copies are eliminated from the process and destroyed.</li>
                <li>Parcels sent to the invoicing address will be returned to the Sender and all related cost will be charged to the Customer.</li>
                <li>If OpusCapita receives letters which are not addressed to the Customer they will be returned back to local mail provider. </li>
                <li>Credit invoices and copies of invoices (without receiving the original invoices) will be processed as an invoice. </li>
                <li>Payment reminders is rejected and returned to the Customer as non-valid document type</li>
            </ul>
            `;

        let deTuC = `
            Um unseren Digitalisierungs-Service zu nutzen, müssen Sie uns Ihre Papierrechnungen zusenden.
            Hierbei ist eine eindeutige Kunden-Id pro Einkaufsorganisation zwingend erforderlich.
            Jede Rechnung muss die korrekte Rechnungsadresse mit der passenden Kunden-Id enthalten.
            Sollte der Kunde nicht eindeutig identifiziert werden können, wird die automatisierte
            Verarbeitung abgebrochen und die Rechnung als Kopie an den Kunden per E-Mail weitergeleitet.
            <br/>
            Die eindeutige Kunden-Id ist ein Pflichtfeld und muss über die Papierrechnung bestimmt werden können.
            Ohne diese Information könnnen wir eine Weiterleitung der Rechnung an den Kunden nicht garantieren.
            Kopf- und Fußdaten müssen passend und verständlich hinterlegt sein, so werden Kopf- und Fußdaten
            zum Beispiel nicht in den Rechnungsdetails oder im Anhang ausgewertet.
            </br>
            Folgende Kopf- und Fußdaten werden im Service weiterverarbeitet. Fehlen Pflichtfelder, so finden
            Sie Information zu der Behandlung in folgender Tabelle:
            <br/>
            <br/>
            ` +
            invoiceActionTable +
            `
            <br/>
            <br/>
            Voraussetzungen für die Verarbeitung von Papierrechnungen in der Rechnungsdigitalisierung:
            <ul/>
                <li>Die Standardgröße für zu scannende Dokumente in DIN A4.</li>
                <li>Kleinere Dokumente werden entweder in ihrer tatsächlichen Größe eingescannt oder zuvor auf einem DIN A4 Blatt plaziert.</li>
                <li>Die Scan-Auflösung beträgt 300 dpi.</li>
                <li>Wir arbeiten mit schwarz-weiß Bilddateien.</li>
                <li>Jede Rechnung wird zusammen mit ihren Anhängen gescannt und in einer einzelnen Datei abgelegt.</li>
                <li>Alle Rechnungen werden verarbeitet und gescannt. Rechnungsanhänge passieren zusammen mit der Rechnung den kompletten Verarbeitungsprozess.</li>
                <li>Falls Papierrechnung und Anhänge mehr als 500 Seiten benötigen, werden die Rechnungen ohne Anhang verarbeitet.</li>
                    <ul>
                        <li>In solch einem Fall wird OpusCapita eine Zusatzinformation zur gescannten Rechnung hinzufügen.</li>
                    </ul>

                <li>Rechnungen mit Formaten größer als DIN A4 - bis zu DIN A3 - und Rechnungen mit Formaten kleiner als DIN A5 erfordern eine manuelle Bearbeitung.</li>
                <li>Dokumente jenseits von Rechnungen sowie optisch nicht erfassbare Rechnungen (zerrissen, schwer beschädigt, etc.), unleserliche Dokumente oder Rechnungen, die die Größevorgaben nicht einhalten, werden zu der vorliegenden Kundenadresse weitergeleitet.</li>
                <li>Werbung, Kundenmagazine, Preislisten, Broschüren und Rechnungskopien werden aus dem Verarbeitungsprozess entfernt und vernichtet.</li>
                <li>Geschenke, die an die Adresse für die Papierrechnungen gegangen sind, werden zurückgeschickt. Alle entstandenden Kosten werden dem Kunden in Rechnung gestellt.</li>
                <li>Empfangene Post, die nicht an den Kunden adressiert ist, geht zurück an den lokalen Postversorger.</li>
                <li>Gutschriftrechnungen und Rechnungskopien ohne vorhergehendem Empfang der Originalrechnung, werden als Rechnungen weiterverarbeitet.</li>
                <li>Zahlungserinnerungen werden abgelehnt und an den Kunden als ungültige Dokumententypen zurückgeschickt.</li>
            </ul>
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
                <h3>{this.context.i18n.getMessage('ServiceConfigFlow.Paper.congratulations')}</h3>
                <div>
                    {this.context.i18n.getMessage('ServiceConfigFlow.Paper.subheader', {customerName : this.props.voucher.customerName})}
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
                            {this.context.i18n.getMessage('ServiceConfigFlow.Paper.readOCTaC')}
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

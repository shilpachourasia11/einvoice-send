export default {
    previous: "Zurück",
    submit: "Weiter",
    accept: "OK",
    congratulations: "Glückwunsch!",

    ServiceConfigFlowStart : {
        header: "Konfiguration des In-Channel-Services",
        hello : "Einladung durch Kunden {customer}",
        intro1 : "Ihr Kunde {customer} hat Sie eingeladen, um am OpusCapita Business Network teilzuhaben.",
        intro2 : "Bitte bestimmen Sie unten, wie Sie Ihre Rechnungen bereitstellen wollen.",
        helloWithoutCustomer: "Entschuldigung, für Sie liegt keine Einladung (Voucher) vor.",
        intro1WithoutCustomer: "Bitte kontaktieren Sie Ihren Kunden für eine Einladung.",
        freeFor: "Frei für {customer}",

        eInvoice: "eInvoice",
        eInvoiceDesc: "Wählen Sie die passende E-Invoicing-Option und wir werden die Verbindung für Sie aufsetzen.",

        pdf : "PDF per Email",
        pdfDesc: "Sie möchten Ihre Rechnung als Anhang einer E-Mail verschicken? Kein Problem. In der Vervollständigung der Registrierung finden Sie mehr Informationen hierzu.",

        supplierPortal : "Lieferanten Portal",
        supplierPortalDesc: "Sie können Rechnungnen per manueller Eingabe der notwendigen Daten hinterlegen.",

        paper : "Papierrechnung",
        paperDesc: "So gewünscht, können Sie auch Papierrechnungen verschicken. Lesen Sie mehr dazu in der Registrierung."
    },

    ServiceConfigFlow : {
        header: "Service Konfigurations-Flow",
        backToTypeSelection: "Zurück zur Selektion",
        readOCTaC: "Ich habe die allgemeine Geschäftsbedingungen gelesen und verstanden.",

        Pdf:{
            subheader: "You have successfully registered on behalf of {customer}. Please read through the following prerequisites and requirements and accept the terms in order to send your first invoice in PDF-format by E-Mail..",
            intro: "Email Invoice Digitizing enables {this.props.voucher.customerName} to receive invoices as email attachments. OpusCapita has therefor allocated an email address per buyer unit. The address will have the following format: [customerId].FI.P.101234-3@docinbound.com",

            Upload: {
                header: "PDF Beispiel einer Rechnung",
                subheader: "Legen Sie Ihre PDF-Beispieldatei unten ab.",
                intro: "Um ein passendes Mapping für Sie zu hinterlegen, benötigen wir von Ihnen eine Beispielrechnung. Im Rahmen der Registrierung laden Sie bitte eine entsprechende Datei hoch.",
                dropHere: "Bitte legen Sie Ihre PDF-Beispieldatei hier ab.",
                uploaded: "Hochgeladen:"
            },
            Approve: {
                header: "Die nächsten Schritte",
                subheader: "Sie haben uns alle notwendigen Daten bereitgestellt.",
                text1: "Nun, da Sie uns Ihre Beispieldatei bereitgestellt haben, werden wir die automatische Verarbeitung vorbereiten.",
                text2: "Sie werden eine Nachricht erhalten, sobald das System für Sie eingerichtet ist. Sie erhalten von uns die E-Mail-Adresse, an welche Sie die Rechnungen zu schicken haben. Bitte verwenden Sie nur diese E-Mail-Adresse."
            }
        },
        Paper:{
            subheader: "You have successfully registered on behalf of {customer}. Please read through the following prerequisites and requirements and accept the terms in order to send your first paper- invoice to our global digitizing (scanning) service.",
            Approve: {
                header: "Die nächsten Schritte",
                subheader: "Sie haben uns alle notwendigen Daten bereitgestellt.",
                text1: "Sie erhalten von uns eine Benachrichtigung, sobald die Vorbereitungen abgeschlossen sind. In dieser E-Mail finden Sie die Adresse für den E-Mail-Versand der Papierrechnungen. Bitte verwenden Sie nur diese Adresse.",
                text2: ""
            }
        },
        CustomerTaC: {
            subheader: "Allgemeine Geschäftsbedingungen von {customerName}",
            subsubheader: "Bitte prüfen Sie die Please Allgemeinen Geschäftsbedingungencheck und bestätigen diese unten auf der Seite.",
            readTaC: "Ich habe die allgemeine Geschäftsbedingungen von {customerName} gelesen und akzeptiert.",
        }
    }
}

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
        freeFor: "Frei for {customer}",

        eInvoice: "eInvoice",
        eInvoiceDesc: "Connect with your existing service provider for e-invoicing by simply choose your operator from our partner list and we set up your connection in no time.",

        pdf : "PDF per Email",
        pdfDesc: "By sending your invoice as PDF attached to an email you can easily submit your invoice. Continue registration and Read more under option PDF by email in order to proceed.",

        supplierPortal : "Lieferanten Portal",
        supplierPortalDesc: "By manual key in your invoice data you can easily submit your invoice in the correct format. Continue registration and Read more under option Supplier Portal in order to proceed.",

        paper : "Papierrechnung",
        paperDesc: "It is still possible to send paper invoices. Continue registration and read more under option Paper Invoice in order to proceed."
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
                subheader: "Drop your invoice example PDF below",
                intro: "In order to provide a proper mapping of your invoices, we need an example PDF. All required data has to be provided in the example.<br/>Please upload a proper example PDF in the Drag & Drop section below.",
                dropHere: "Please drop your PDF Example here.",
                uploaded: "Uploaded:"
            },
            Approve: {
                header: "Next Steps",
                subheader: "All required steps from your side are done.",
                text1: "Now that you have uploaded the invoice example, we will setup the automated processing of your invoices. Usually this will take about 3 days.",
                text2: "You will receive an notification as soon as the required setup is done. This email will also provide the email address that you have to use to send your invoices to us. Please use this email address only."
            }
        },
        Paper:{
            subheader: "You have successfully registered on behalf of {customer}. Please read through the following prerequisites and requirements and accept the terms in order to send your first paper- invoice to our global digitizing (scanning) service.",
            Approve: {
                header: "Nächste Schritte",
                subheader: "All required steps from your side are done.",
                text1: "You will receive an notification as soon as the required setup is done. This email will also provide the email address that you have to use to send your invoices to us. Please use this email address only.",
                text2: ""
            }
        },
        CustomerTaC: {
            subheader: "Terms and Conditions of {customerName}",
            subsubheader: "Please check the terms and conditions below and confirm your acceptance at the end of this page.",
            readTaC: "I have read and understood {customerName} terms and conditions of the service",
        }
    }
}

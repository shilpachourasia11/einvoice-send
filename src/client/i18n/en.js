export default {
    previous: "Previous",
    submit: "Submit",
    accept: "Accept",
    saveAndContinue: "Save & Continue",
    congratulations: "Congratulations!",

    ServiceConfigFlowStart : {
        header: "Configuration of the In-Channel-Service",
        hello : "Invitation by Customer {customerName}",
        intro1 : "Your Customer {customerName} invited you to participate on the OpusCapita Business Network.",
        intro2 : "Please select below the way on how you want to provide invoices.",

        helloWithoutCustomer: "Sorry, we couldn't find a voucher for you.",
        intro1WithoutCustomer: "If you just registered as a supplier: Voucher generation may take a minute. ",
        reloadVoucher: "Check for new Voucher",

        freeFor: "Free for you for {customerName}",

        eInvoice: "eInvoice",
        eInvoiceDesc: "Connect with your existing service provider for e-invoicing by simply choose your operator from our partner list and we set up your connection in no time.",

        pdf : "PDF by Email",
        pdfDesc: "By sending your invoice as PDF attached to an email you can easily submit your invoice. Continue registration and Read more under option PDF by email in order to proceed.",

        supplierPortal : "Supplier Portal",
        supplierPortalDesc: "By manual key in your invoice data you can easily submit your invoice in the correct format. Continue registration and Read more under option Supplier Portal in order to proceed.",

        paper : "Paper Invoice",
        paperDesc: "It is still possible to send paper invoices. Continue registration and read more under option Paper Invoice in order to proceed."
    },

    ServiceConfigFlow : {
        header: "Service Configuration Flow",
        backToTypeSelection: "Back to Type Selection",
        readOCTaC: "I have read and understood OpusCapitas terms and conditions of the service",

        Pdf:{
            subheader: "You have successfully registered on behalf of {customerName}. Please read through the following prerequisites and requirements and accept the terms in order to send your first invoice in PDF-format by E-Mail.",
            intro: "Email Invoice Digitizing enables {customerName} to receive invoices as email attachments. OpusCapita has therefor allocated an email address per buyer unit. The address will have the following format: [customerId].FI.P.101234-3@docinbound.com",

            Upload: {
                header: "Invoice PDF Example",
                subheader: "Drop your invoice example PDF below",
                intro: "In order to provide a proper mapping of your invoices, we need an example PDF. All required data has to be provided in the example. Please upload a proper example PDF in the Drag & Drop section below.",
                dropHere: "Please drop your PDF Example here.",
                uploaded: "Uploaded:"
            },
            Approve: {
                header: "Next Steps",
                subheader: "All required steps from your side are done.",
                text1: "Now that you have uploaded the invoice example, we will setup the automated processing of your invoices.",
                text2: "You will receive an notification as soon as the required setup is done. This email will also provide the email address that you have to use to send your invoices to us. Please use this email address only."
            }
        },
        Paper:{
            subheader: "You have successfully registered on behalf of {customerName}. Please read through the following prerequisites and requirements and accept the terms in order to send your first paper- invoice to our global digitizing (scanning) service.",
            Approve: {
                header: "Next Steps",
                subheader: "All required steps from your side are done.",
                text1: "You will receive an notification as soon as the required setup is done. This email will also provide the address that you have to use for your invoices. Please use this address only.",
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

export default {
    previous: "Previous",
    submit: "Submit",
    accept: "Accept",
    saveAndContinue: "Save & Continue",
    congratulations: "Congratulations!",
    welcome: "Welcome!",

    ServiceConfigFlowStart : {
        header: "Configuration of the In-Channel-Service",
        hello : "Invitation by Customer {customerName}",
        intro1 : "Your Customer {customerName} invited you to participate on the OpusCapita Business Network.",
        intro2 : "Please select below the way on how you want to provide invoices.",

        helloWithoutCustomer: "Sorry, we couldn't find a voucher for you.",
        intro1WithoutCustomer: "If you just registered as a supplier, Voucher generation may take a minute: ",
        reloadVoucher: "Check for new Voucher",

        helloWithoutValidationSuccess: "Please complete your Supplier Profile",
        intro1WithoutValidatinoSuccess: "Your profile data requires some improvements before you can start with the configuration of the In-Channel. Please provide either your VAT Registration Number or an IBAN: ",
        supplierProfile: "Supplier Profile",

        freeFor: "At no charge for you as supplier of {customerName}",
        intention: "Confirm your intention",

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
        enterEmail: "Email address",

        Einvoice:{
            intro: "We are sorry that we cannot provide an eInvoice web integration right now, but it will be available soon. If you want to provide invoices via web service, please confirm this intention below.",
            einvoiceWanted:"Yes, we want to use eInvoice",
            einvoiceNotWanted:"No, we do not support eInvoice",
            saved:"Your decission is saved.",
            intro2:"Please proceed with completing you inchannel configuration with the available options",
            continue:"continue"
        },
        Pdf:{
            subheader: "You have successfully registered on behalf of {customerName}. Please read through the following prerequisites and requirements and accept the terms in order to send your first invoice in PDF-format by E-Mail.",
            intro: "Email Invoice Digitizing enables {customerName} to receive invoices as email attachments.",
            rejection:"Rejection Email",
            additionalHelp:"In the case that problems appear when processing your PDF invoices, we need an email address that we can use to contact you.",

            Upload: {
                header: "Invoice PDF Example",
                subheader: "Drop your invoice example PDF below",
                intro: "In order to provide a proper mapping of your invoices, we need an example PDF. All required data has to be provided in the example. Please upload a proper example PDF in the Drag & Drop section below.",
                dropHere: "Please drop your PDF Example here.",
                uploaded: "Uploaded:"
            },
            Approve: {
                header: "Next Steps",
                subheader: "All required steps from your side are done and your are now able to send your first invoice as PDF by Email.",
                text: "",
                textFooter: "We kindly ask you to go back to the start page and update your company information in order to strengthen your profile to become more visible to trading partners within the Eco System.",
                textGreetings: "Thank you!"
            }
        },
        Paper:{
            subheader: "You have successfully registered on behalf of {customerName}. Please read through the following prerequisites and requirements and accept the terms in order to send your first paper- invoice to our global digitizing (scanning) service.",
            Approve: {
                header: "Next Steps",
                subheader: "All required steps from your side are done and your are now able to send your first paper-invoice.",
                text: "",
                textFooter: "We kindly ask you to go back to the start page and update your company information in order to strengthen your profile to become more visible to trading partners within the Eco System.",
                textGreetings: "Thank you!"
            }
        },
        CustomerTaC: {
            subheader: "Terms and Conditions of {customerName}",
            subsubheader: "Please check the terms and conditions below and confirm your acceptance at the end of this page.",
            readTaC: "I have read and understood {customerName} terms and conditions of the service",
        }
    }
}

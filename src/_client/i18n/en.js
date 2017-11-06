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
        add2EInvoice: "when using existing Service Provider",
        intention: "Confirm your intention",

        eInvoice: "eInvoice",
        eInvoiceDesc: "Connect with your existing service provider for e-invoicing by simply choose your operator from our partner list and we set up your connection in no time.",

        pdf : "PDF by Email",
        pdfDesc: "By sending your invoice as PDF attached to an email you can easily submit your invoice. Continue registration and Read more under option PDF by email in order to proceed.",

        keyIn : "Invoice Key In",
        keyInDesc: "By manual key in your invoice data you can easily submit your invoice in the correct format. Continue registration and Read more under option Supplier Portal in order to proceed.",

        paper : "Paper Invoice",
        paperDesc: "It is still possible to send paper invoices. Continue registration and read more under option Paper Invoice in order to proceed.",

        status: "Status",
        statuses: {
            undefined: "Is not configured.",
            new: "Was selected, but configuration is pending.",
            approved: "Is configured, but not activated.",
            configured: "Is configured",
            activated: "Is activated.",
            notActivated: "Is not activated.",

            einvoiceRequested: "You want to have an eInvoice integration.",
            einvoiceRejected: "You don't want an eInvoice integration.",
            stated: "Your intention is stated."
        }
    },

    ServiceConfigFlow : {
        header: "Service Configuration Flow",
        backToTypeSelection: "Back to Type Selection",
        readOCTaC: "I have read and understood OpusCapitas terms and conditions of the service",
        enterEmail: "Email address",

        Einvoice:{
            name: "eInvoice",
            header: "Configuration eInvoice ",
            OCTaC: {
                text: "You want to send E-Invoices to {customerName} through a third party Operator?"
            },
            Step1: {
                subheader: "Guidelines for eInvoicing",
                subsubheader: "You have successfully registered on behalf of {customerName}. Please read carefully through the following prerequisites as well as Supplier Guideline description and accept the terms before sending your first E-invoice by using Interconnect Operator Network.",
                text1: "E-invoice Sending",
                li1: "Connect with your existing service provider for e-invoicing",
                li2: "Simply utilize your operator from our partner list (list of available partners can be seen on below Supplier Guideline description) and send the E-invoices to {customerName}.",
                li3: "E-invoice sending means that invoice data with the invoice picture is taken directly from your billing system and sent to your service provider who then routes the e-invoices to OpusCapita which delivers the E-invoices to  {customerName}. The usage of operator ID and e-invoice address are required. You will see correct ID and address information on below Supplier Guideline description.",
                li4: "In case of your operator is new to us, OpusCapita takes care of the technical details with the operator.",
                moreInfo: "Read more in Supplier Guideline Description for {customerName}",
                accepted: "I have read and understood OpusCapitas terms and conditions of the service.",
            },
            Step2: {
                subheader: "Guidelines for eInvoice by {customerName}",
                subsubheader: "Please check the guidelines below and confirm your acceptance at the end of this page.",
                approve: "I have read and understood {customerName} guidelines."
            },
            Step3: {
                header: "Next Steps",
                subheader: "Please setup the einvoice as described in the einvoicing guide. This should include the three steps:",
                step1: "Contact your E-invoicing service provider ",
                step2: "Test E-invoice / Testing phase",
                step3: "Go live",
                text: "",
                supportHint: "In case of questions, please contact our support by phone +49 231 3967 350 or via email  customerservice.de@opuscapita.com.",
                textFooter: "We kindly ask you to go back to the start page and update your company information in order to strengthen your profile to become more visible to trading partners within the Eco System.",
                textGreetings: "Thank you!"
            }
        },
        Pdf:{
            name: "PDF by Email",
            header: "Configuration PDF by Email ",
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
            name: "Paper Invoice",
            header: "Configuration Paper Invoice ",
            subheader: "You have successfully registered on behalf of {customerName}. Please read through the following prerequisites and requirements and accept the terms in order to send your first paper- invoice to our global digitizing (scanning) service.",
            Approve: {
                header: "Next Steps",
                subheader: "All required steps from your side are done and your are now able to send your first paper-invoice.",
                text: "",
                textFooter: "We kindly ask you to go back to the start page and update your company information in order to strengthen your profile to become more visible to trading partners within the Eco System.",
                textGreetings: "Thank you!"
            }
        },
        KeyIn:{
            name: "Invoice Key In",
            header: "Configuration Invoice Key In",
            Step1: {
                subheader: "Guidelines for Invoice Key In",
                subsubheader: "You have successfully registered on behalf of {customerName}. Please read carefully through the following prerequisites as well as Supplier Guideline description and accept the terms before sending your first E-invoice by using Interconnect Operator Network.",
                text1: "Invoice Key In",
                li1: "Finalize your configuration for Invoice Key In",
                li2: "Click ”Invoice Key In” from menu",
                li3: "Select your customer",
                li4: "Type in Invoice data",
                li5: "Send Invoices to your customer",
                moreInfo: "Read more in Supplier Guideline Description for Invoice Key In",
                accepted: "I have read and understood OpusCapitas terms and conditions of the service.",
            },
            Step2: {
                subheader: "Guidelines for Invoice Key In by {customerName}",
                subsubheader: "Please check the requirements below and confirm your acceptance at the end of this page.",
                approve: "I have read and understood {customerName} guidelines."
            },
            Step3: {
                header: "Next Steps",
                subheader: "All required steps from your side are done and you are now able to send your first invoice through Invoice Key In.",
                textFooter: "We kindly ask you to go back to the start page and update your company information in order to strengthen your profile to become more visible to trading partners within the Eco System.",
                textGreetings: "Thank you!"
            }
        },
        CustomerTaC: {
            subheader: "Terms and Conditions of {customerName}",
            subsubheader: "Please check the terms and conditions below and confirm your acceptance at the end of this page.",
            readTaC: "I have read and understood {customerName} terms and conditions of the service.",
        }
    }
}
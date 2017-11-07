export default {
    'CSWTranslations.supplierCount' : 'Connected Suppliers',
    previous: "Previous",
    submit: "Submit",
    accept: "Accept",
    saveAndContinue: "Save & Continue",
    congratulations: "Congratulations!",
    welcome: "Welcome!",

    ServiceConfigFlowStart : {
        header: "Configuration of the In-Channel-Service",
        hello : "Invitation by Customer {customerName}",

        intro : "Your Customer {customerName} invited you to participate on the OpusCapita Business Network.\n Please select below the way on how you want to provide invoices.",

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
    }
}

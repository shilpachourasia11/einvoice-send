export default {
    ServiceConfigFlow : {
        Einvoice:{
            name: "eInvoice",
            header: "Configuration eInvoice ",
            backToTypeSelection: "Back to Type Selection",
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
        }
    }
}

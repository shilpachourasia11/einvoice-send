export default {
    'CSWTranslations.supplierCount' : 'Aktivierte Lieferanten',
    previous: "Zurück",
    submit: "Weiter",
    accept: "OK",
    saveAndContinue: "Speichern & Weiter",
    congratulations: "Glückwunsch!",
    welcome: "Willkommen!",

    ServiceConfigFlowStart : {
        header: "Konfiguration des In-Channel-Services",
        hello : "Einladung von Ihrem Kunden {customerName}",
        intro : "Ihr Kunde {customerName} hat Sie eingeladen, um am OpusCapita Business Network teilzuhaben. \n Bitte bestimmen Sie unten, wie Sie Ihre Rechnungen bereitstellen wollen.",

        helloWithoutCustomer: "Entschuldigung, für Sie liegt aktuell keine Einladung (Voucher) vor.",
        intro1WithoutCustomer: "Falls Sie sich gerade erst als Lieferant registriert haben, die Generierung der Einladung benötigt einen Moment. ",
        reloadVoucher: "Auf neue Einladung prüfen",

        helloWithoutValidationSuccess: "Bitte vervollständigen Sie Ihr Profil",
        intro1WithoutValidatinoSuccess: "Um mit der Konfiguration der Anbindung fortfahren zu können, fehlen noch Informationen. Bitte stellen Sie in Ihrem Profil entweder die Umsatzsteuer-Ident-Nr. oder eine IBAN bereit: ",
        supplierProfile: "Lieferantenprofil",

        freeFor: "Kostenfrei für Sie als Lieferant der {customerName}",
        add2EInvoice: "unter Verwendung eines gelisteten Dienstleisters",
        intention: "Absichtserklärung",

        eInvoice: "eInvoice",
        eInvoiceDesc: "Sie wünschen eine elektronische Rechnungsstellung?  Wählen Sie die passenden Optionen und wir werden die Verbindung für Sie aufsetzen.",

        pdf : "PDF per Email",
        pdfDesc: "Sie möchten Ihre Rechnung als Anhang einer E-Mail verschicken? Kein Problem. In der Vervollständigung der Registrierung finden Sie mehr Informationen hierzu.",

        keyIn : "Key-In-Rechnungserfassung",
        keyInDesc: "Wählen Sie diese Option, um Ihre Rechnungen über ein Erfassungsformular selbständig zu hinterlegen.",

        paper : "Papierrechnung",
        paperDesc: "So gewünscht, können Sie auch Papierrechnungen verschicken. Lesen Sie mehr dazu in der Registrierung.",

        status: "Status",
        statuses: {
            undefined: "Ist nicht konfiguriert.",
            new: "Wurde ausgewählt, aber die Konfiguration wurde noch nicht abgeschlossen.",
            approved: "Wurde konfiguriert, aber noch nicht aktiviert.",
            configured: "Ist konfiguriert",
            activated: "Ist aktiviert.",
            notActivated: "Ist nicht aktiviert.",

            einvoiceRequested: "Sie wünschen eine eInvoice-Anbindung.",
            einvoiceRejected: "Sie wünschen keine eInvoice-Anbindung.",
            stated: "Ihre Wunsch ist hinterlegt."
        }
    }
}

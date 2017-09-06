export default {
    previous: "Zurück",
    submit: "Weiter",
    accept: "OK",
    saveAndContinue: "Speichern & Weiter",
    congratulations: "Glückwunsch!",
    welcome: "Willkommen!",

    ServiceConfigFlowStart : {
        header: "Konfiguration des In-Channel-Services",
        hello : "Einladung von Ihrem Kunden {customerName}",
        intro1 : "Ihr Kunde {customerName} hat Sie eingeladen, um am OpusCapita Business Network teilzuhaben.",
        intro2 : "Bitte bestimmen Sie unten, wie Sie Ihre Rechnungen bereitstellen wollen.",

        helloWithoutCustomer: "Entschuldigung, für Sie liegt aktuell keine Einladung (Voucher) vor.",
        intro1WithoutCustomer: "Falls Sie sich gerade erst als Lieferant registriert haben, die Generierung der Einladung benötigt einen Moment. ",
        reloadVoucher: "Auf neue Einladung prüfen",

        helloWithoutValidationSuccess: "Bitte vervollständigen Sie Ihr Profil",
        intro1WithoutValidatinoSuccess: "Um mit der Konfiguration der Anbindung fortfahren zu können, fehlen noch Informationen. Bitte stellen Sie in Ihrem Profil entweder die Umsatzsteuer-Ident-Nr. oder eine IBAN bereit: ",
        supplierProfile: "Lieferantenprofil",

        freeFor: "Frei für Sie für Kunde {customerName}",
        intention: "Absichtserklärung",

        eInvoice: "eInvoice",
        eInvoiceDesc: "Sie wünschen eine elektronische Rechnungsstellung?  Wählen Sie die passenden Optionen und wir werden die Verbindung für Sie aufsetzen.",

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
        enterEmail: "E-Mail-Adresse",

        Einvoice:{
            intro: "Hier werden wir Ihnen die Konfiguration der eInvoice-Anbindung per Webservice anbieten. Leider ist diese noch nicht verfügbar. Sobald eine Anbindung möglich ist, werden wir uns mit Ihnen in Verbindung setzen, sofern Sie dies wünschen und unten bestätigen.",
            einvoiceWanted: "Ja, wir wünschen eine eInvoice-Anbindung",
            einvoiceNotWanted: "Wir unterstützen kein eInvoice",
            saved:"hre Erklärung bzgl. der zukünftigen Nutzung der eInoice-Anbindung ist gespeichert.",
            intro2:"Bitte vervollständigen Ihre Anbindungsdefinition über die Ihnen zur Verfügung stehenden Optionen",
            continue:"Fortfahren",
        },
        Pdf:{
            subheader: "Sie habe sich erfolgreich für Ihren Kunden {customerName} registriert. Bitte lesen Sie sorgfältig die Voraussetzungen und Bedingungen und akzeptieren diese, bevor Sie Ihre PDF-Rechnungen per E-Mail an uns senden.",
            intro: "Der OpusCapita Digitalisierungs-Service erlaubt Ihnen Ihre Rechnungen an {customerName} per E-Mail-Anhang bereitzustellen.",
            rejection:"Rückweisungs E-Mail",
            additionalHelp:"Für den Fall eines Problems mit der Verarbeitung Ihrer PDF-Rechnungen benötigen wir von Ihnen eine E-Mail-Adresse, unter der wir Sie kontaktieren können.",

            Upload: {
                header: "PDF Beispiel einer Rechnung",
                subheader: "Legen Sie Ihre PDF-Beispieldatei unten ab.",
                intro: "Um ein passendes Mapping für Sie zu hinterlegen, benötigen wir von Ihnen eine Beispielrechnung. Im Rahmen der Registrierung laden Sie bitte eine entsprechende Datei hoch.",
                dropHere: "Bitte legen Sie Ihre PDF-Beispieldatei hier ab.",
                uploaded: "Hochgeladen:"
            },
            Approve: {
                header: "Die nächsten Schritte",
                subheader: "Sie haben uns alle notwendigen Daten bereitgestellt und können uns jetzt Ihre erste Rechnung als PDF per E-Mail zusenden.",
                text: "",
                textFooter: "Ist Ihr Unternehemensprofil vollständig? Ein vollständiges Profil erleichtert die Interaktion mit alten und neuen Handelspartnern über diese Plattform. Im Menü finden Sie den Menüpunkt zur Pflege Ihres Unternehmensprofils.",
                textGreetings: "Vielen Dank!"
            }
        },
        Paper:{
            subheader: "Sie habe sich erfolgreich für Ihren Kunden {customerName} registriert. Bitte lesen Sie sorgfältig die Voraussetzungen und Bedingungen und akzeptieren diese, bevor Sie Ihre Papierrechnung an unseren globalen Digitalisierung-Service senden.",
            Approve: {
                header: "Die nächsten Schritte",
                subheader: "Sie haben uns alle notwendigen Daten bereitgestellt und können uns jetzt Ihre erste Papierrechnung zusenden.",
                text: "",
                textFooter: "Ist Ihr Unternehemensprofil vollständig? Ein vollständiges Profil erleichtert die Interaktion mit alten und neuen Handelspartnern über diese Plattform. Im Menü finden Sie den Menüpunkt zur Pflege Ihres Unternehmensprofils.",
                textGreetings: "Vielen Dank!"
            }
        },
        CustomerTaC: {
            subheader: "Allgemeine Geschäftsbedingungen von {customerName}",
            subsubheader: "Bitte prüfen Sie die Allgemeinen Geschäftsbedingungencheck und bestätigen diese unten auf der Seite.",
            readTaC: "Ich habe die allgemeine Geschäftsbedingungen von {customerName} gelesen und akzeptiert.",
        }
    }
}

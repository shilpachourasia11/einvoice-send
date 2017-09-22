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

        freeFor: "Kostenfrei für Sie als Lieferant der {customerName}",
        intention: "Absichtserklärung",

        eInvoice: "eInvoice",
        eInvoiceDesc: "Sie wünschen eine elektronische Rechnungsstellung?  Wählen Sie die passenden Optionen und wir werden die Verbindung für Sie aufsetzen.",

        pdf : "PDF per Email",
        pdfDesc: "Sie möchten Ihre Rechnung als Anhang einer E-Mail verschicken? Kein Problem. In der Vervollständigung der Registrierung finden Sie mehr Informationen hierzu.",

        supplierPortal : "Lieferantenportal",
        supplierPortalDesc: "Sie können Rechnungnen per manueller Eingabe der notwendigen Daten hinterlegen.",

        paper : "Papierrechnung",
        paperDesc: "So gewünscht, können Sie auch Papierrechnungen verschicken. Lesen Sie mehr dazu in der Registrierung.",

        status: "Status",
        statuses: {
            undefined: "Ist nicht konfiguriert.",
            new: "Wurde ausgewählt, aber die Konfiguration steht noch aus.",
            approved: "Wurde konfiguriert, aber noch nicht aktiviert.",
            configured: "Ist konfiguriert",
            activated: "Ist aktiviert.",
            notActivated: "Ist nicht aktiviert.",

            einvoiceRequested: "Sie wünschen eine eInvoice-Anbindung.",
            einvoiceRejected: "Sie wünschen keine eInvoice-Anbindung.",
            stated: "Ihre Wunsch ist hinterlegt."
        }
    },

    ServiceConfigFlow : {
        header: "Service Konfigurations-Flow",
        backToTypeSelection: "Zurück zur Selektion",
        readOCTaC: "Ich habe die allgemeine Geschäftsbedingungen gelesen und verstanden.",
        enterEmail: "E-Mail-Adresse",

        Einvoice:{
            name: "eInvoice",
            header: "eInvoice-Konfiguration",
            OCTaC: {
                text: "Sie möchten elektronische Rechnungen an {customerName} über einen anderen Anbieter schicken?"
            },
            Step2: {
                subheader: "Richtlinien zur eInvoice-Anbindung",
                subsubheader: "Um die eInvoice-Anbindung für Ihren Kunden {customerName} zu konfigurieren, prüfen Sie bitte die hier aufgeführten Voraussetzungen sowie den Lieferantenleitfaden und akzeptieren diese unten auf der Seite.",
                text1: "E-invoice Übertragung",
                li1: "Kontaktieren Sie Ihren E-Rechnungsdienstleisters oder",
                li2: "wählen Sie einen E-Rechnungsdienstleisters aus unserer Liste der Partner (s. Lieferantenleitfaden) aus.",
                li3: "E-Invoice-Übertragung bedeutet, dass Ihr Abrechnungssystem mit dem System Ihres E-Rechnungsdienstleisters kommuniziert und Ihre E-Rechnungen übestellt. Im nächsten Schritt überstellt Ihr Dienstleister die Rechnungsinformationen an OpusCapita. Und zu guter letzt überstellt OpusCapita die E-Rechnungen an {customerName}. Hierbei sind die Angaben der Kennung des E-Rechnungsdienstleisters (Vermittlers) und der E-Rechnungsadressinformationen erforderlich. Informationen hierzu finden Sie unten im Lieferantenleitfaden.",
                li4: "Nutzen Sie einen nicht genannten Service-Dienstleister, dann kontaktiert OpusCapita Ihren Dienstleister, um die technischen Details zu klären.",
                moreInfo: "Einen detaillierte Lieferantenleitfaden finden Sie hier: ",
                accepted: "Ich habe die Anforderungen der OpusCapita gelesen und akzeptiert.",
            },
            Approve: {
                header: "Die nächsten Schritte",
                subheader: "Bitte setzen Sie das EInvoicing gemäß der Anleitung auf. Dies sollte die folgenden drei Schritte beinhalten:",
                step1: "Kontaktieren Sie Ihren E-Invoicing-Service-Provider",
                step2: "Test der E-Invoice-Anbindung",
                step3: "Go-live",
                textFooter: "Ist Ihr Unternehemensprofil vollständig? Ein vollständiges Profil erleichtert die Interaktion mit bestehenden und neuen Handelspartnern über diese Plattform. Im Menü finden Sie den Menüpunkt zur Pflege Ihres Unternehmensprofils.",
                textGreetings: "Vielen Dank!"
            }
        },
        Pdf:{
            name: "PDF per Email",
            header: "PDF per Email-Konfiguration",
            subheader: "Sie haben sich erfolgreich für Ihren Kunden {customerName} registriert. Bitte lesen Sie sorgfältig die Voraussetzungen und Bedingungen und akzeptieren diese, bevor Sie Ihre PDF-Rechnungen per E-Mail an uns senden.",
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
                textFooter: "Ist Ihr Unternehemensprofil vollständig? Ein vollständiges Profil erleichtert die Interaktion mit bestehenden und neuen Handelspartnern über diese Plattform. Im Menü finden Sie den Menüpunkt zur Pflege Ihres Unternehmensprofils.",
                textGreetings: "Vielen Dank!"
            }
        },
        Paper:{
            name: "Papierrechnung",
            header: "Papierrechnung-Konfiguration",
            subheader: "Sie haben sich erfolgreich für Ihren Kunden {customerName} registriert. Bitte lesen Sie sorgfältig die Voraussetzungen und Bedingungen und akzeptieren diese, bevor Sie Ihre Papierrechnung an unseren globalen Digitalisierung-Service senden.",
            Approve: {
                header: "Die nächsten Schritte",
                subheader: "Sie haben uns alle notwendigen Daten bereitgestellt und können uns jetzt Ihre erste Papierrechnung zusenden.",
                text: "",
                textFooter: "Ist Ihr Unternehemensprofil vollständig? Ein vollständiges Profil erleichtert die Interaktion mit bestehenden und neuen Handelspartnern über diese Plattform. Im Menü finden Sie den Menüpunkt zur Pflege Ihres Unternehmensprofils.",
                textGreetings: "Vielen Dank!"
            }
        },
        SupplierPortal:{
            name: "Lieferantenportal",
            header: "Lieferantenportal-Konfiguration"
        },
        CustomerTaC: {
            subheader: "Allgemeine Geschäftsbedingungen der {customerName}",
            subsubheader: "Bitte prüfen Sie die Allgemeinen Geschäftsbedingungencheck und bestätigen diese unten auf der Seite.",
            readTaC: "Ich habe die allgemeine Geschäftsbedingungen der {customerName} gelesen und akzeptiert.",
        }
    }
}

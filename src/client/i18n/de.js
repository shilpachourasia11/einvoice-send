export default {
    previous: "Zurück",
    submit: "Weiter",
    accept: "OK",
    congratulations: "Glückwunsch!",

    ServiceConfigFlowStart : {
        header: "Konfiguration des In-Channel-Services",
        hello : "Einladung durch Kunden {customerName}",
        intro1 : "Ihr Kunde {customerName} hat Sie eingeladen, um am OpusCapita Business Network teilzuhaben.",
        intro2 : "Bitte bestimmen Sie unten, wie Sie Ihre Rechnungen bereitstellen wollen.",
        helloWithoutCustomer: "Entschuldigung, für Sie liegt aktuell Einladung (Voucher) vor.",
        intro1WithoutCustomer: "Falls Sie sich gerade erst als Lieferant registriert haben: Die Generierung der Einladung benötigt einen Moment. Bitte versuchen Sie es in Kürze erneut.",
        freeFor: "Frei für Sie für Kunde {customerName}",

        eInvoice: "eInvoice",
        eInvoiceDesc: "Sie wünschen eine elektronische Rechnungsstellung?  Wählen Sie die passende Optionen und wir werden die Verbindung für Sie aufsetzen.",

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
            subheader: "Sie habe sich erfolgreich für Ihren Kunden {customerName} registriert. Bitte lesen Sie sorgfältig die Voraussetzungen und Bedingungen und akzeptieren diese, bevor Sie Ihre PDF-Rechnungen per E-Mail an uns senden.",
            intro: "Der OpusCapita Digitalisierungs-Service erlaubt Ihnen Ihre Rechnungen an {customerName} per E-Mail-Anhang bereitzustellen. OpusCapita legt dazu für Sie eine eine E-Mail-Adresse an. Die Adressen wird das Format haben:  {customerId}.FI.P.101234-3@docinbound.com",

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
            subheader: "Sie habe sich erfolgreich für Ihren Kunden {customerName} registriert. Bitte lesen Sie sorgfältig die Voraussetzungen und Bedingungen und akzeptieren diese, bevor Sie Ihre Papierrechnung an unseren globalen Digitalisierung-Service senden.",
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

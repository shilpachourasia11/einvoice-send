export default {
    ServiceConfigFlow : {
        Einvoice:{
            name: "eInvoice",
            header: "Konfiguration eInvoice",
            backToTypeSelection: "Zurück zur Selektion",
            OCTaC: {
                text: "Sie möchten elektronische Rechnungen an {customerName} über einen anderen Anbieter schicken?"
            },
            Step1: {
                subheader: "Richtlinien zur eInvoice-Anbindung",
                subsubheader: "Um die eInvoice-Anbindung für Ihren Kunden {customerName} zu konfigurieren, prüfen Sie bitte die hier aufgeführten Voraussetzungen sowie den Lieferantenleitfaden und akzeptieren diese unten auf der Seite.",
                text1: "E-invoice Übertragung",
                li1: "Kontaktieren Sie Ihren E-Rechnungsdienstleisters oder",
                li2: "wählen Sie einen E-Rechnungsdienstleisters aus unserer Liste der Partner (s. Lieferantenleitfaden) aus.",
                li3: "E-Invoice-Übertragung bedeutet, dass Ihr Abrechnungssystem mit dem System Ihres E-Rechnungsdienstleisters kommuniziert und Ihre E-Rechnungen übestellt. Im nächsten Schritt überstellt Ihr Dienstleister die Rechnungsinformationen an OpusCapita. Und zu guter letzt überstellt OpusCapita die E-Rechnungen an {customerName}. Hierbei sind die Angaben der Kennung des E-Rechnungsdienstleisters (Vermittlers) und der E-Rechnungsadressinformationen erforderlich. Informationen hierzu finden Sie unten im Lieferantenleitfaden.",
                li4: "Nutzen Sie einen nicht genannten Service-Dienstleister, dann kontaktiert OpusCapita Ihren Dienstleister, um die technischen Details zu klären.",
                moreInfo: "Einen detaillierten Lieferantenleitfaden finden Sie hier: ",
                accepted: "Ich habe die Anforderungen der OpusCapita gelesen und akzeptiert.",
            },
            Step2: {
                subheader: "Richtlinien der {customerName} zur eInvoice-Anbindung",
                subsubheader: "Bitte prüfen Sie die Richtlinien der {customerName} und bestätigen diese unten auf der Seite.",
                approve: "Ich habe die Richtlinien der {customerName} gelesen und akzeptiert."
            },
            Step3: {
                header: "Die nächsten Schritte",
                subheader: "Bitte setzen Sie das EInvoicing gemäß der Anleitung auf. Folgen Sie dabei bitte den im Lieferantenleitfaden beschriebenen Schritten:",
                step1: "Kontaktieren Sie Ihren E-Fakturierungsdienstleister ",
                step2: "Test-E-Rechnung/Testphase",
                step3: "Go-live",
                text: "Bitte nutzen Sie „PDF per Mail“ für Ihre zwischenzeitliche Rechnungsstellung, bis die Konfiguration der eInvoice-Anbindung komplett abgeschlossen ist.",
                supportHint: "Bei Fragen kontaktieren Sie bitte unseren Support per Telefon unter +49 231 3967 350 oder per E-Mail via customerservice.de@opuscapita.com.",
                textFooter: "Ist Ihr Unternehemensprofil vollständig? Ein vollständiges Profil erleichtert die Interaktion mit bestehenden und neuen Handelspartnern über diese Plattform. Im Menü finden Sie den Menüpunkt zur Pflege Ihres Unternehmensprofils.",
                textGreetings: "Vielen Dank!"
            }
        }
    }
}

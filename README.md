# Blitzlesen

Ein schlichtes, als PWA installierbares und offline nutzbares Lesetraining für Kinder. Pro Runde werden 60 Sekunden lang einzelne Wörter gezeigt. Ein großer roter Knopf schaltet zum nächsten Wort.

## Spielmodi

- **Ultraleicht 1:** Alltagswörter in einer festen, durchmischten Reihenfolge
- **Ultraleicht 2:** dieselben Wörter, in jeder Runde neu gemischt
- **Herbst – Stufe 1:** Herbstwörter in fester Reihenfolge
- **Herbst – Stufe 2:** Herbstwörter, in jeder Runde neu gemischt

Jedes Wort erscheint höchstens einmal innerhalb einer regulären Runde. Mit **Noch einmal** lässt sich das vorherige Wort erneut lesen; die Zeit läuft weiter.

## Ergebnisse und Profile

- Lokale Profile mit getrennten Ergebnissen pro Stufe
- Datum und Uhrzeit für neu gespeicherte Versuche
- Grün-gelbe Ergebnisbalken: geschaffte Wörter und zusätzliche Wiederholungen
- Liste schwieriger Wörter mit einzelnem Entfernen
- Speicherung ausschließlich im Browser (`localStorage`), ohne Server

**Wichtig:** Die Daten sind *nur in diesem Browser auf diesem Gerät* verfügbar. Das Löschen von Browser- oder Websitedaten, private Browserfenster oder ein Gerätewechsel können gespeicherte Profile und Ergebnisse unzugänglich machen. Es gibt derzeit keine Cloud-Synchronisierung oder Export-/Import-Funktion.

## Auf GitHub veröffentlichen

1. Ein neues **öffentliches** GitHub-Repository erstellen, zum Beispiel `blitzlesen`.
2. Die Dateien aus diesem Paket **direkt in das Hauptverzeichnis des Repositories** hochladen (`index.html`, `manifest.webmanifest`, `sw.js`, den Ordner `icons/`, `README.md`, `.nojekyll`).
3. Auf GitHub unter **Settings → Pages** bei **Build and deployment** die Option **Deploy from a branch** auswählen.
4. Branch `main`, Ordner `/(root)` auswählen und **Save** drücken.
5. Anschließend steht die Seite normalerweise unter `https://DEIN-BENUTZERNAME.github.io/blitzlesen/` zur Verfügung (Groß-/Kleinschreibung des Repository-Namens beachten).

## Auf Android installieren und offline verwenden

1. Die GitHub-Pages-Webadresse **einmal mit Internetverbindung in Chrome** öffnen.
2. Warten, bis die Seite vollständig geladen ist. Dann im Chrome-Menü **„App installieren“** oder gegebenenfalls **„Zum Startbildschirm hinzufügen“** wählen.
3. Die App nach der Installation einmal starten. Anschließend kann sie auch ohne Netz genutzt werden.
4. Test: Flugmodus einschalten und die installierte App starten. Wortkarten und Ergebnisse müssen weiter funktionieren.

**Hinweis:** Eine Installation als eigene App hängt von Browser und Android-Version ab. Die Offline-Speicherung verwendet einen Service Worker und funktioniert auf der GitHub-Pages-Adresse (HTTPS), **nicht** beim direkten Öffnen einer `file://`-Datei. Bestehende Spielstände in einer lokal geöffneten Datei werden nicht automatisch in die GitHub-Pages-App übertragen.

Du kannst die `index.html` auch direkt als Datei im Browser öffnen. Das eingebettete Papierbild und die Spielwörter benötigen keine externe Internetverbindung. Für eine stabilere Speicherung auf dem Handy empfiehlt sich der Aufruf über dieselbe GitHub-Pages-Adresse.

## Technik

Reines HTML, CSS und JavaScript, ohne Build-Schritt und ohne externe JavaScript-Bibliotheken. Mit PWA-Manifest, App-Symbolen und Service Worker für die Offline-Nutzung. Das Papierhintergrundbild ist direkt in `index.html` eingebettet. Keine persönlichen Ergebnisdaten werden ins GitHub-Repository hochgeladen.

## Hinweise

Die App misst bestätigte Wortwechsel, keine automatische Erkennung korrekt ausgesprochener Wörter. Der Button **Noch einmal** markiert Wörter für zusätzliche Übung. Die gespeicherten Daten sind nicht als standardisierter Lesetest zu verstehen.

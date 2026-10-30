# Blitzschnelle Spiele

Dieses Repository enthält den gemeinsamen Einstieg für **Wörter lesen** und **Lücken füllen**. Beide Spiele verwenden lokale Kinderprofile und sind für die Installation als PWA und den Offlinebetrieb vorbereitet.

Stand dieser Beschreibung: 30.10.2026, mit den vorhandenen Quellen abgeglichen. Eine Quellcodeprüfung ersetzt keinen Geräte- oder Offline-Test.

## Spiele und Einstieg

| Datei | Funktion |
|---|---|
| [index.html](index.html) | Spielauswahl, Profilwahl, Ergebnisübersicht und Erwachsenenbereich |
| [woerterlesen/index.html](woerterlesen/index.html) | Wörter lesen |
| [bild-und-satz/index.html](bild-und-satz/index.html) | Lücken füllen |
| [manifest.webmanifest](manifest.webmanifest) / [sw.js](sw.js) | Gemeinsames Installations- und Offline-Paket |

„Blitzlesen“ bleibt der Repository-Name. Die gemeinsame Oberfläche heißt „Blitzschnelle Spiele“.

## Wörter lesen

Eine Runde dauert bis zu 60 Sekunden; sie endet auch, wenn alle Wörter des Vorrats bestätigt sind. Der große rote Button **Weiter** bestätigt das aktuelle Wort und zeigt das nächste. Das Spiel erkennt weder die Aussprache noch die Richtigkeit des Vorlesens automatisch.

| Stufe | Vorrat | Reihenfolge |
|---|---|---|
| Ultraleicht 1 | 100 Alltagswörter | fest |
| Ultraleicht 2 | dieselben 100 Wörter | neu gemischt |
| Herbst · Stufe 1 | 100 Herbstbegriffe | fest |
| Herbst · Stufe 2 | dieselben 100 Begriffe | neu gemischt |

**Oh, oh – Noch einmal!** geht zum vorherigen Wort zurück. Dabei wird eine bereits gezählte Bestätigung zurückgenommen, eine Wiederholung gezählt und das Wort in der Liste schwieriger Wörter gesammelt. Die Zeit läuft weiter.

Die Auswertung zeigt bestätigte Wörter und Wiederholungen als grün-gelbe Lesetreppe. Ergebnisse werden je Profil und Stufe mit Datum und Uhrzeit gespeichert. Schwierige Wörter lassen sich einzeln entfernen. Nach Rundenende sind Neustart und Stufenwechsel nach drei Sekunden verfügbar.

## Lücken füllen

Das Kind betrachtet ein Bild und ergänzt den passenden Satz. Für jede Lücke stehen drei Wortkarten zur Auswahl; genau eine Antwort ist hinterlegt. Wortkarten können in die Lücke gezogen oder ausgewählt und anschließend durch Antippen der Lücke eingesetzt werden.

**60 unterschiedliche Bildsätze mit 60 Bildern** bilden drei Vorräte zu jeweils 20 Sätzen:

| Stufe | Lücken je Satz | Vorrat / Reihenfolge |
|---|---:|---|
| Einfach | 1 | einfache Sätze, fest |
| Etwas schwieriger | 1 | dieselben Sätze, gemischt |
| Noch schwieriger | 2 | mittlere Sätze, fest |
| Schwer | 2 | dieselben Sätze, gemischt |
| Lustig | 2 | lustige Sätze, fest |
| Lustig, aber schwieriger | 2 | dieselben Sätze, gemischt |

Die sechs Stufen verwenden die drei Vorräte mehrfach; es sind insgesamt 60 unterschiedliche Sätze.

- **Zeitrunde:** bis zu einer Minute oder bis alle 20 Sätze gelöst sind. Nach einem vollständigen Satz folgt automatisch die nächste Aufgabe.
- **Übungsmodus:** ohne Zeitlimit, mit Vorwärts-/Rückwärtsnavigation und Zurücksetzen der aktuellen Aufgabe; ohne gespeicherte Rekordwertung.
- Falsche Einsetzversuche bleiben korrigierbar. In Zeitrunden werden gelöste Sätze und falsche Einsetzversuche getrennt dargestellt. „Noch einmal“ zählt hier Einsetzfehler, beim Wörterlesen dagegen Wortwiederholungen.
- Ergebnisse und Bestwerte der Zeitrunden werden je Profil und Stufe gespeichert.

## Kinderprofile, Ergebnisse und Erwachsenenbereich

Die gemeinsame Startseite verwaltet Kinderprofile und zeigt pro Stufe Bestwerte sowie die drei jüngsten Ergebnisbalken. Die Daten bleiben im lokalen Speicher dieses Browsers auf diesem Gerät.

Im **Erwachsenenbereich** lassen sich für ein gewähltes Profil:

- einzelne Stufen zurücksetzen,
- Ergebnisse eines Spiels oder beider Spiele zurücksetzen,
- schwierige Wörter löschen,
- das gesamte Profil samt Ergebnissen löschen,
- Sicherungen aller Profile und Spielstände als JSON-Datei herunterladen und wieder einlesen.

Ein Import ersetzt nach Bestätigung die aktuellen Profile und Ergebnisse dieses Pakets durch die Sicherung. Es gibt keine automatische Cloud-Synchronisierung. Browser-/Websitedaten löschen, privater Modus, eine andere Webadresse oder ein Gerätewechsel können den Zugriff auf bisherige lokale Daten verändern. Vor einem Wechsel eine Sicherungsdatei erstellen und aufbewahren.

Die Messwerte zählen bestätigte Eingaben; sie sind kein standardisierter Lesetest.

## Lokale Vorschau und Veröffentlichung

Es ist kein Build-Schritt erforderlich. Für eine vollständige lokale Vorschau im Repository-Ordner einen statischen Server starten:

```sh
python -m http.server 8765 --bind 127.0.0.1
```

Anschließend http://127.0.0.1:8765/ öffnen. Für die Installation und Service Worker sind HTTPS oder localhost erforderlich; eine direkt geöffnete HTML-Datei bietet kein gemeinsames Offline-Paket.

Beim Bereitstellen den **gesamten Bestand mit beiden Teilspielordnern, Bildern, Symbolen, Manifest und Service Worker** erhalten. Nur die Hauptdatei hochzuladen reicht nicht. Die tatsächliche GitHub-Pages-/Domainkonfiguration ist von den Quelldateien zu unterscheiden.

## Installation, Offline und Aktualisierung

Die Startseite einmal über die vorgesehene Webadresse online öffnen. Der Service Worker enthält beide Spiele und alle 60 Lückenfüllbilder. Eine Installation über die Browserfunktion hängt vom Gerät und Browser ab. Den Offlinebetrieb nach vollständigem Laden durch erneutes Öffnen ohne Netz prüfen.

Aktueller Cache im Quellcode: **`blitzlesen-offline-v6`**. Ältere Hinweise auf v2 beschreiben einen früheren Stand. Bei Änderungen an den Anwendungsdateien auch den Offline-Cache berücksichtigen. Ein Wechsel von Domain oder Browser überträgt lokale Profile nicht automatisch.

## Technik und Dokumentationsstand

Statische HTML-/CSS-/JavaScript-Dateien ohne externe JavaScript-Bibliotheken. Ergebnisse werden nicht ins Repository hochgeladen.

Die Beschreibung wurde mit Startseite, beiden Teilspielen, Manifest und Service Worker abgeglichen. Gerätebedienung, Installation und Offlinebetrieb müssen separat geprüft werden. Die frühere Aussage „keine Export-/Import-Funktion“ ist durch den vorhandenen Erwachsenenbereich überholt.

Historie: Am 08.10.2026 wurde die Freigabe von Neustart/Stufenwechsel nach Rundenende berichtigt. Der heutige gemeinsame Einstieg und Cache v6 sind davon zu unterscheiden.

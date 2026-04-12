# Refresh Access Tk

## Szenarien

Generell: Die Middleware wird getriggered, um zu schauen, ob der Refresh Tk im cookie ist oder nicht. Das geschieht bevor überhaubt der user die website sieht. Middleware ist also eine konvention von Next.js. 

### Szenario 1: Der User hat keinen Refresh Token im Cookie

---

### Ablauf

### 1️⃣ Middleware - Erste Prüfung

**User will `/home` besuchen**

### Fall A: Refresh Token vorhanden ✅

- Wir schauen zuerst, ob er einen Refresh Token hat
- Wenn **ja**, dann lassen wir ihn durch
- Wenn das der Fall ist, wird der **AuthProvider.tsx** getriggered, und wir fetchen den Access Token
- → Das wäre dann **Szenario 2** wie weiter unten beschrieben

### Fall B: Kein Refresh Token ❌

- Wenn **nicht**, dann leiten wir um auf die **Sign-in-Seite**, wo er sich nochmal authentifizieren muss
1. Wenn nicht, dann leiten wir um auf die sign-in seite wo er sich nochmal authentifizieren muss. 

### Szenario 2: Der User hat einen Refresh Token als Cookie

Wenn der User nun sagen wir sich authentifiziert hat und sich entschließt, nach einigen Tagen wieder auf der Website zu surfen, hätte er bereits einen Refresh Token. Dieser darf 30 Tage verwendet werden, also nutzt mein System dann den Refresh Token und baut nur den Access Token und sendet diesen zurück zum Client, damit er sich nicht immer neu anmelden muss oder sonst was. Nach den 30 Tagen, also sollte der Refresh Token abgelaufen sein, dann müsste er sich von neu anmelden aber.

---

### Ablauf

### 1️⃣ Main-Website & Layout-Initialisierung

Das heißt, sollte man auf die Main-Website kommen, in dem Fall z.B. `/home` URL – also wenn man bereits authentifiziert ist – dann landet man im **(appshell) Layout** von Next.js.

**Wichtig zu betonen:**

- Wenn man in dieses Layout landet, wird direkt ein **AuthProvider** initialisiert
- Dieser "umhüllt" den restlichen Code, sodass der restliche Code immer auf den Access JWT zugreifen kann
- Das machen wir deshalb so, weil der Access Token im Layout davor (also wo z.B. das Sign-in-Formular liegt) nichts verloren hat
- Dort brauchen wir nur den Refresh Token

---

### 2️⃣ Automatische Umleitung & Request-Trigger

Das heißt, sollte der Nutzer einen Refresh Token im Cookie haben, wird er sofort – auch wenn er die Sign-in-Seite aufgerufen hat – umgeleitet.

**Was passiert:**

- Er kommt z.B. auf die `/home` URL
- Wir triggern dabei automatisch einen Request, um den Access Token zu holen

---

### 3️⃣ AuthProvider - Access Token holen

Der **AuthProvider** triggered also den Request, sendet den Refresh Token an das Backend und bekommt einen Access Token zurück.

**Der Ablauf im Detail:**

### 3.1 AuthController - Refresh Token extrahieren

Im **AuthController** entnehmen wir den Refresh Token vom Request raus, da wir ebenso im Backend auf die Cookies zugreifen dürfen.

- Wir rufen also im Controller zuerst `extractRefreshToken` auf, um den Token zu bekommen und in der Hand zu halten

**Validierung:**

- Wenn der Refresh Token fälschlicherweise keinen Wert hat → senden wir direkt eine Error Message zurück
- Sollte alles in Ordnung sein → gehen wir einen Schritt weiter

---

### 3.2 Token-Validierung & User laden

Wir rufen nun `validateToken` auf.

**Wie JWT Tokens in unserem System funktionieren:**

- Wenn wir einen JWT Token erstellen, füge ich standardmäßig den Username in den Claims hinzu
- Das heißt, die `validateToken` Methode ist so aufgebaut, dass wir den Username vom Refresh Token extrahieren und damit dann das **UserDetails** laden
- Dabei nutzen wir denselben **"signing-key"**, der in den Conf-Files liegt

**Warum brauchen wir das "sub" field?**

- Wenn also der Refresh Token im Backend ankommt, muss das Backend ja wissen, wer den Request gesendet hat
- Er checkt zwar, ob alles mit dem Key passt, aber ohne das **"sub" field** am JWT Token selbst, der im Payload liegt, wüsste das Backend nicht, wer der User gerade ist
- Dadurch können wir den User also fetchen, der im nächsten Schritt sehr wichtig ist

---

### 3.3 Access Token erstellen & zurücksenden

Wenn der Token also dann in Ordnung ist, kommt er zurück zum **AuthController**.

**Was passiert:**

1. Dort rufen wir dann wieder unsere Methode auf, um den Access Token zu erstellen (wie wir es bei Sign-in z.B. gemacht haben)
2. Der Access Token braucht nämlich wieder den Username für das **"sub" field** im Token
3. Dann senden wir es dem Client zurück

---

### 4️⃣ Client - RTK Cache

Im Client angekommen, geben wir dann von der **Server Action** aus die Daten zurück zu dem **RTK-Abfragen-Aufruf**.

**RTK Cache-Mechanismus:**

- Wenn nämlich die `queryFn` ein Return bekommt, dann schreibt er die Daten, die er bekommen hat, in den **Redux Cache**, den wir im Store definiert haben
- Dabei sagen wir, dass die Daten **900 Sekunden** valid sind, bis die Middleware im Store diese Daten deleted
- **Warum 900 Sekunden?** Weil der Access Token nur **15 Minuten** in meiner Website leben darf

---

### 5️⃣ Access Token im Header

Der Access Token liegt also nun im **RTK Cache**.

**Verwendung im Main-Aufruf von RTK:**

- Wir bereiten dann jedes Mal, bevor ein Request rausgeht, den Header vor, wo wir den Access Token setzen
- Damit z.B. **Shout** nicht wissen muss, wie man an den Token rankommt
- Er sendet nur seinen Request ganz normal
- Wir hängen den Access Token aber immer an den Header ran
- Der dann bei dem Request in der **Security Filter Chain** gecheckt wird

---
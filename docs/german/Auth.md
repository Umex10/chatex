# Chatex - Auth

## Generell

### Ablauf

### 1️⃣ Formular & RTK-Abfrage

Wir entnehmen die Daten vom Registerformular bzw. aus dem "Zod"-Formular und senden es an unsere RTK-Abfrage.

---

### 2️⃣ Next.js Action

Daraufhin rufen wir in der RTK-Abfrage eine Next.js Action auf, damit sensible Daten wie der Refresh Token nicht in den Dev Tools angezeigt werden.

---

### 3️⃣ Server-seitiger Request

In der Action senden wir dann an das Backend. Bzw. sendet Next.js (Server-Seite) an das Backend.

> **Der Clue:** Der Browser sieht diesen Request zwar im Netzwerk-Tab, sieht es aber nicht genau. Also genaue Daten etc. sieht er nicht. Was für die Sicherheit der eingegebenen Daten bzw. dass was wir zurückbekommen – und zwar den Refresh Token – ideal ist.
> 

---

### 4️⃣ Backend - AuthController

Das Backend bekommt also den Request im **AuthController**. Diese Route ist dabei **nicht geschützt**, was ich damit meine ist, dass diese Route keinen Check vorher ausführt, ob man einen JWT Token hat oder nicht, da der User diesen erst nach der erfolgreichen Registrierung/Anmeldung hat.

Wir senden dann den Request vom AuthController weiter an den **Service**.

---

## Registrierung

### 1️⃣ Service - Validierung & Speicherung

Der Service nimmt es entgegen und checkt nochmal, ob die Eingaben des Users passen. Das heißt also:

- **Username**
- **Email**
- **Telefonnummer**

werden extrahiert und gecheckt, ob diese uniquen Daten nicht bereits vergeben sind, da eine Telefonnummer z.B. eindeutig sein muss.

**Wenn alles durchgeht:**

- Keine Errors
- Wir encoden das Kennwort des Users
- Speichern die neue Entität in der Datenbank ab

**Sollte es zu Errors kommen** (z.B. Username ist bereits taken):

- Wir werfen einen **"unchecked" Error** in Java
- Das ist ein Error, der vom Eltern-Aufruf nicht gecheckt werden muss
- Das heißt: Ich brauche **kein** `try-catch` Block oder eine `throws` Deklaration
- Stattdessen brauchen wir eine **zentrale Klasse**, die solche Errors abfängt

**ErrorController:**

- Fängt die Errors ab
- Baut eine Error-Instanz, die wir ebenso festgelegt haben
- Sendet diese dann an den Client zurück
- Dabei entstehen dann Tokens wie `"username already taken"`
- Das betroffene Field im Formular wird auch rötlich markiert (für die Usability)

---

### 2️⃣ Token-Erstellung im AuthController

Wenn die Fields in Ordnung waren, geht es zurück zum **AuthController**, wo nun der wichtige Teil passiert.

Dabei haben wir eine **nicht public Methode**, die was extrem Wichtiges macht. Ich habe diese Methode erstellt, weil mehrere Routes in dem AuthController dieselbe Logik beziehen müssen.

**Was passiert:**

1. Ein **Access Token** wird erstellt
2. Sollte man das Response-Objekt mitgeben, wird auch ein **Refresh Token** erstellt
3. Dieser wird dann auf dem Response-Objekt draufgelegt als `Set-Cookie`
4. Das Frontend darf es rauslesen, um es als Cookie zu speichern im Browser
5. Zuletzt senden wir das Refresh bzw. Access Token zusammen zum Frontend zurück

---

### 3️⃣ Action - Cookie-Handling & Redirect

Die Action empfängt das, checkt ob es Cookies überhaupt gibt, und übergibt es an die **nicht public Methode** `setRefreshCookie`.

**Dabei wird:**

- Der Cookie ausgelesen aus dem Response, den das Backend gesetzt hat
- Wir setzen es in den Browser rein als **HTTP-only Cookie**

Zuletzt geht es zurück zu der **RTK-Abfrage** und dabei zurück zu der Formular `onSend()` Methode.

**Wenn alles gepasst hat:**

- Wie bereits erwähnt keine "Error-Toasts" auftauchen
- Haben wir es erfolgreich geschafft
- ✅ **Wir leiten den User um**

## Login

### 1️⃣ AuthService - Der Authentifizierungsprozess

Wir sind nun im **AuthController**. Dort rufen wir unseren **AuthService** auf. Dabei benutzen wir zwei wichtige Klassen.

### 1.1 AuthenticationManager

Zuerst: Der **AuthenticationManager**, der von Spring Boot injected wird. Das ist ein Interface und er ist sozusagen der "Chef" der Authentifizierung zu einem User. Er arbeitet intern aber mit sehr vielen weiteren Interfaces.

**Wir rufen auf dem Manager die Methode `authenticate()` auf:**

- Dabei übergeben wir eine bestimmte Instanz, damit der Manager intern entscheiden kann, welchen **AuthProvider** er denn nun aufruft
- Da unsere User in unserer Datenbank bzw. überhaupt in einer Datenbank liegen, brauchen wir den **DaoAuthenticationProvider**, der dazu in der Lage ist, aus einer Datenbank zu lesen
- Wir haben dem Manager ebenso davor ein Arg übergeben bzw. eine bestimmte Instanz, die wiederum Username und Key erwartet, was wir vom User nun bekommen haben, weil er sich einloggen will

---

### 1.2 DaoAuthenticationProvider - User laden

Der Manager entscheidet sich also für den **DaoAuthenticationProvider** und nutzt diesen.

**Im nächsten Schritt:**

- Diese Instanz hat zwar den Username und den "Key", aber er weiß damit nichts anzufangen
- Da er den Username aber kennt, ruft er auf einem bestimmten Interface die Methode `loadUserByUsername(String username)` auf
- Das ist ein Interface direkt von Spring Boot gegeben, damit Spring Boot in Auth-Fällen auch weiß, wie man an den User kommt aus der DB bzw. wie man den User aus der DB lädt

---

### 1.3 UserDetailsService Implementation

Diese Methode implementieren wir natürlich und nutzen unsere **Repository-Schnittstelle**, so weiß Spring Boot bzw. der Provider, wie er an den User gelangt.

**Was passiert:**

- Er hat nun den Username und Key aus dem Formular
- Aber auch den gehashten Key aus der DB
- Da aber der Security Layer nur mit **UserDetails** arbeitet und nicht dem Service davon (also **UserDetailsService**), verpacken wir den User in das **UserDetails** und returnen es dem Provider

---

### 1.4 Password-Vergleich

Der Provider hat nun den User. Er ruft nun `getPassword()` auf und bekommt den gehashten Key.

**Nun übergibt er beides an den PasswordEncoder:**

- Denselben, den wir bei der Registrierung für das Hashen des Keys verwendet haben
- Er weiß am besten, ob die zwei Keys dann gleich sind und vergleicht diese

**Fall 1: Keys stimmen NICHT überein** ❌

- Er gibt dem **DaoAuthenticationProvider** dann zurück mit einem Boolean-Wert, also `false`
- Der **DaoProvider** wirft einen **BadCredentialsException**
- Diese Exception erbt von der Mutter, also **AuthenticationException**, und das ist die zentrale Exception, die geworfen wird, wenn ein Fehler bei der Authentifizierung stattfindet
- Diesen Fehler behandeln wir natürlich im **ErrorController**
- Und senden an den Client ein `"The credentials are incorrect"` zurück
- Woraufhin beim Client ein Toast angezeigt wird

---

### 1.5 Authentication-Objekt erstellen

**Fall 2: Keys stimmen überein** ✅

Sollte der Encoder aber `true` zurückgeben (das heißt die Keys stimmen überein), dann erstellt der **DaoProvider** nochmal die gleiche Instanz, die wir im Manager übergeben haben.

**Dabei handelt es sich um:**

- Das **Authentication** Interface
- Und das **UsernamePasswordAuthenticationToken** implementiert diese
- Das **Authentication** Interface sagt dabei aus, dass jeder ein `getAuthorities()` haben muss
- Und das **UsernamePasswordAuthenticationToken** hat genau das – in dem Fall ist das eine Authentifizierung mit Username und Password

---

### 1.6 Authenticated Flag setzen

Das heißt, wir geben dem Manager zwar ein `new UsernamePasswordAuthenticationToken`, aber da ist ein Feld, was standardmäßig auf `false` ist: Das ist das Feld **"authenticated"**.

**Wenn also der Encoder `true` returned:**

- Dann baut der **DaoProvider** nochmal so eine Instanz der gleichen Klasse auf
- Und löscht dabei die Credentials, da sie nicht mehr im RAM liegen müssen
- Und setzt dabei aber das **authenticated** Field auf `true`
- Das returned er dem Manager

**Der Manager** würde also theoretisch dem AuthService auch das Authentication returnen, aber in dem Fall brauchen wir es nicht zu machen. Stattdessen reicht es uns, wenn wir wissen, dass es glatt lief ohne Credentials-Error. Weil wir danach sowieso dem User antworten und damit der Request endet. Normalerweise könnte man das Objekt in den **Security Context** schreiben.

---

### 2️⃣ AuthService - UserDetails zurückgeben

Nun sind wir mit dem Code durch und returnen im **AuthService** das **UserDetails**.

Damit wir im nachherigen Verlauf wieder:

- Ein **Access Token** erstellen
- Und den **Refresh Token** erstellen

Dann setzen wir den **Refresh Cookie** darauf und senden es an den Client zurück.

---

### 3️⃣ Action - Cookie-Handling & Redirect

Die Action empfängt das, checkt ob es Cookies überhaupt gibt, und übergibt es an die **nicht  Methode** `setRefreshCookie`.

**Dabei wird:**

- Der Cookie ausgelesen aus dem Response, den das Backend gesetzt hat
- Wir setzen es in den Browser rein als **HTTP-only Cookie**

Zuletzt geht es zurück zu der **RTK-Abfrage** und dabei zurück zu der Formular `onSubmit()` Methode.

**Wenn alles gepasst hat:**

- Wie bereits erwähnt keine "Error-Toasts" auftauchen
- Haben wir es erfolgreich geschafft
- ✅ **Wir leiten den User um**
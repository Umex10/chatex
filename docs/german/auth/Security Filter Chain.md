# Security Filter Chain

## Der beschütze Request (Stateless Flow)

Wenn der User nun eine Aktion ausführt, die nur für angemeldete Nutzer erlaubt ist, passiert Folgendes:

---

### 1️⃣ Backend - Eintritt in die Security Filter Chain

Der Request kommt im Backend an. Bevor er den Controller erreicht, muss er die **Security Filter Chain** durchlaufen. Das ist wie eine Reihe von Sicherheitsschleusen:

**Die Filter in der Chain:**

- **CORS-Filter:** Prüft zuerst, ob die Anfrage von deiner erlaubten Domain (`localhost:3000`) kommt
- **CSRF-Filter:** Da wir `sessionManagement` auf **STATELESS** gesetzt haben, ist dieser Filter deaktiviert
- **Mein `JwtAuthenticationFilter`:** Diesen haben wir mit `addFilterBefore` an eine strategische Stelle gesetzt (vor den `UsernamePasswordAuthenticationFilter`)

---

### 2️⃣ Der JwtAuthenticationFilter (Die Identitätsprüfung)

Hier passiert die eigentliche "Magie":

### 2.1 Extraction

Der Filter extrahiert den String aus dem `Authorization`-Header und entfernt das Präfix `"Bearer "`.

---

### 2.2 Validierung

Der **JwtService** prüft die Signatur des Tokens mit dem Secret Key. Ist der Token abgelaufen oder manipuliert?

**Falls ungültig:**

- Wir werfen **keine Exception**, sondern lassen den SecurityContext einfach leer

---

### 2.3 UserDetails laden

Wenn das Token gültig ist, laden wir die Benutzerdaten (Rollen, ID) in ein **`UserDetails`-Objekt**.

---

### 2.4 Context füllen

- Wir erstellen ein **`UsernamePasswordAuthenticationToken`**
- Das ist unser "verifizierter Ausweis"
- Diesen legen wir in den **`SecurityContextHolder`**

---

### 3️⃣ Das Finale in der Filter Chain (Die Erlaubnis)

Der Request wandert weiter zum letzten Filter, dem **AuthorizationFilter**:

**Was passiert:**

1. Dieser schaut in unsere **`SecurityConfig`Regeln** (`.anyRequest().authenticated()`)
2. Er prüft den **`SecurityContextHolder`**
3. **Ergebnis:** Da unser JWT-Filter zuvor einen gültigen "Ausweis" dort hinterlegt hat, sagt dieser Filter: **"Zugriff erlaubt!"** und leitet den Request an den eigentlichen Controller weiter

---

### 4️⃣ Controller & Service

### Direkter Zugriff

Im Controller können wir nun über **`@AuthenticationPrincipal`** direkt auf den User zugreifen.

### userId Shortcut

Da wir im Filter `request.setAttribute("userId", ...)` genutzt haben, kann der Controller die ID des Users ohne Umwege auslesen.

### Verarbeitung

Der Service führt die Logik aus (z. B. Nachricht senden) und schickt die Daten zurück.

---

## Zusammenfassung der Architektur-Bausteine

| Komponente | Aufgabe im Projekt |
| --- | --- |
| **`SecurityConfig`** | Die Schaltzentrale. Hier definieren wir, welche Pfade frei sind und welche Bausteine (Manager, Encoder) wir brauchen. |
| **`JwtAuthenticationFilter`** | Der "Türsteher". Er ist der einzige, der das JWT liest und die Identität für den aktuellen Request feststellt. |
| **`SecurityContextHolder`** | Der temporäre Tresor. Er speichert die Identität nur für die Dauer eines einzigen Requests. |
| **`PasswordEncoder`** | Stellt sicher, dass wir in der Datenbank niemals echte Passwörter sehen, sondern nur sichere Hashes. |
| **`AuthenticationManager`** | Das Gehirn beim Login. Er prüft einmalig Passwort/Username, damit wir danach das JWT ausstellen können. |
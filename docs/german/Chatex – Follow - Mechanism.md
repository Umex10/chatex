# Chatex – Follow M:N

[Chatex_follow_m_n_cleaned](https://www.notion.so/Chatex_follow_m_n_cleaned-3194e760adb380b79eabf0444b31e8a9?pvs=21)

## Was ist überhaupt eine M:N-Beziehung?

Eine M:N-Beziehung wird normalerweise durch eine **neue Zwischentabelle** beschrieben. Das klassische Beispiel: Ein Student besucht viele Fächer, und ein Fach hat viele Studenten – das ist eine M:N-Beziehung.

In unserem Social-Media-System brauchen wir diese Beziehung ebenfalls, weil ein User **zwei Rollen** gleichzeitig einnehmen darf:

- **Rolle A (Following):** Ein User kann **vielen** anderen Usern folgen.
- **Rolle B (Follower):** Ein User kann von **vielen** anderen Usern gefolgt werden.

---

## Was beinhaltet die Zwischentabelle?

Die Zwischentabelle beschreibt die **Aktion selbst**: *„User A folgt User B”*. Man kann diese Tabelle also aus zwei Richtungen lesen.

**Beispiel:**

| follower_id | following_id |
| --- | --- |
| 1 (Max) | 2 (Lisa) |
| 1 (Max) | 3 (Kevin) |
| 2 (Lisa) | 1 (Max) |

**Was lesen wir daraus?**

- **Zeilen 1 & 2:** Max (1) folgt zwei Personen (Lisa und Kevin). Er hat also **2 Followings**.
- **Zeilen 1 & 3:** Lisa (2) wird von Max gefolgt und folgt selbst auch Max. Sie hat **1 Follower** (Max) und **1 Following** (Max).
- **Zeile 2:** Kevin (3) wird von Max gefolgt. Er hat **1 Follower**, folgt aber selbst niemandem.

> 💡 **Wichtig:** Der entscheidende Unterschied zu einem klassischen Beispiel wie „Student & Fächer” ist, dass unser Follow-System eine **Self-referencing M:N-Beziehung** ist. Die Beziehung geht also vom User zur Zwischentabelle – und dann wieder zurück zum User.
> 

---

## Die Referenz

- Bei einer M:N-Beziehung braucht die `User`Tabelle **keine direkte Referenz** auf die Zwischentabelle. In DB Beaver sieht man die Zwischentabelle trotzdem mit ihren Einträgen.
- M:N ist standardmäßig **LAZY**. Das heißt: Wenn ich einen User requeste und nicht explizit z. B. `getFollowers()` aufrufe, werden die Follower **nicht mitgeladen**.

---

## Java: Wie setzt man das Follow-System um?

Wir beginnen in der `User`-Entity und definieren zwei Felder: `following` und `followers`.

```java
@ManyToMany
@JoinTable(
    name = "user_follows",
    joinColumns = @JoinColumn(name = "follower_id"),
    inverseJoinColumns = @JoinColumn(name = "following_id")
)
@Builder.Default
private Set<User> following = new HashSet<>();

@Builder.Default
@ManyToMany(mappedBy = "following")
private Set<User> followers = new HashSet<>();
```

---

## Warum ein `Set` und keine `List`?

### 1. Semantik & Leistung

- Eine `List` würde im Worst Case die **gesamte Liste durchlaufen**, um einen User zu finden → `O(n)`.
- Ein `Set` arbeitet mit `hashCode` und `equals` zusammen → **O(1)**.

### 2. Keine Reihenfolge notwendig

- Eine `List` ist immer geordnet. SQL würde intern eine Indexliste mitführen – dabei ist beim Thema „Followers” eine Reihenfolge vollkommen irrelevant. Es geht uns nur um: *Ist ein User in der Liste enthalten? Ja oder nein?*

### 3. Keine Duplikate erlaubt

- Ein User darf einem anderen User nur **einmal** folgen. Eine Liste, in der ein User doppelt vorkommen kann, wäre also semantisch falsch.

---

## Wie arbeitet ein `Set` mit `equals` und `hashCode` zusammen?

### Die Idee

1. Mit dem `hashCode` berechnet Java eine **Adresse** (eine „Schublade”), in der die Instanz abgelegt wird. Dadurch findet Java sie auch in O(1) wieder.
2. Mehrere Instanzen können in dieselbe Schublade landen, wenn sie denselben `hashCode` haben – Java verwaltet diese dann intern als Liste. Diesen Fall nennt man eine **Kollision**.
3. Um bei einer Kollision zu entscheiden, ob zwei Instanzen **wirklich gleich** sind, nutzt Java die `equals`Methode.
4. Durch `equals` garantiert das `Set`, dass **keine Duplikate** enthalten sind.

> 🧠 **Die equals/hashCode-Regel als Analogie:**
> 
> 
> Wenn du zwei Personen triffst, die **Geschwister** sind (`equals == true`), weißt du sofort: Sie heißen beide „Müller” (`hashCode` ist gleich).
> 
> Aber: Wenn zwei Personen beide „Müller” heißen (`hashCode` ist gleich), heißt das noch lange nicht, dass sie Geschwister sind – sie könnten zufällig denselben Namen tragen. → Das ist eine **Kollision**.
> 

---

## Das `Set` in unserer Social-Media-App mit Lombok

In einer Spring Boot App nutzen wir Lombok mit Annotationen wie `@Data`, `@Getter` – und eben auch `@EqualsAndHashCode`.

Da das `Set` zwingend auf `equals` und `hashCode` angewiesen ist, brauchen wir ein **spezielles Setting**:

```java
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;
}
```

Mit `onlyExplicitlyIncluded = true` sagen wir Lombok: *„Beziehe nur Felder ein, die explizit mit `@EqualsAndHashCode.Include` markiert sind.”* In unserem Fall ist das nur die `id`, da sie der eindeutige Identifier des Users ist.

### Was würde ohne diese Einstellung sein?

Lombok würde versuchen, den `hashCode` der gesamten `User`-Instanz zu berechnen. Da der User zwei `Set<User>`-Felder hat, müsste Lombok für jeden User darin ebenfalls einen `hashCode` berechnen – und so weiter, rekursiv. Das endet in einem **StackOverflow**.

Dieses bekannte Problem nennt sich das **Circular Reference Issue**.

# 📘 Notiz: Self-Referencing Many-to-Many in JPA

---

## 🚀 Das Szenario

Ein User kann vielen Usern folgen (**Following**) und von vielen Usern abonniert werden (**Followers**). Da beide Seiten der Beziehung vom Typ `User` sind, handelt es sich um eine **selbstreferenzierende M:N-Beziehung**.

---

## 💻 Der Code

```java
@ManyToMany
@JoinTable(
    name = "user_follows",
    joinColumns = @JoinColumn(name = "follower_id"),
    inverseJoinColumns = @JoinColumn(name = "following_id")
)
@Builder.Default
private Set<User> following = new HashSet<>();

@ManyToMany(mappedBy = "following")
@Builder.Default
private Set<User> followers = new HashSet<>();
```

---

## 🔍 Schritt-für-Schritt Erklärung

### 1. Warum `Set<User>`?

- **Keine Duplikate:** Ein User kann dir nicht zweimal folgen.
- **Performance:** Ein `HashSet` arbeitet mit O(1) Suchzeit. Dank `hashCode()` findet Java sofort die richtige „Schublade" (Bucket) und prüft mit `equals()`, ob die ID übereinstimmt.

---

### 2. Der „Owner" der Beziehung (`following`)

Das Feld `following` ist der **Besitzer (Owner)** der Beziehung. Nur dieses Feld bestimmt, was in die Datenbank geschrieben wird.

| Annotation | Bedeutung |
| --- | --- |
| `@JoinTable` | Erstellt die physische Zwischentabelle `user_follows` |
| `joinColumns` | Der **„Anker"** – speichert die ID des Users, der die Liste owned (der Follower) |
| `inverseJoinColumns` | Der **„Pfeil"** – speichert die ID des Users, der in die Liste aufgenommen wird (das Following-Ziel) |

---

### 3. Die „Spiegel-Seite" (`followers`)

Das Feld `followers` ist die **passive Seite** der Beziehung.

> 💡 **`mappedBy = "following"`** ist der Wegweiser. Er sagt JPA:
*„Ich habe keinen eigenen Bauplan. Schau einfach beim Feld `following` nach, um herauszufinden, wie wir verbunden sind."*
> 
- **Bidirektionalität:** Ohne dieses Feld könnten wir zwar fragen *„Wem folgt Max?"*, aber nicht *„Wer folgt Max?"*. Die Annotation macht die Beziehung in Java von **beiden Seiten** aus lesbar.

# 📘 Notiz: JPA Joins & Fetching (Follower vs. Following)

### 🚀 Das Prinzip

Da unsere Follower-Beziehung `LAZY` (faul) ist, würde JPA beim normalen Laden eines Users die Listen leer lassen. Um das **n+1 Problem** zu vermeiden, nutzen wir **JPQL** mit dem `JOIN FETCH` Befehl.

---

### 💻 Die Queries im Vergleich

```java
// 1. Die "Wer folgt mir?" Abfrage
@Query("SELECT u FROM User u LEFT JOIN FETCH u.followers WHERE u.username = :username")
Optional<User> findByUsernameWithFollowers(@Param("username") String username);

// 2. Die "Wem folge ich?" Abfrage
@Query("SELECT u FROM User u LEFT JOIN FETCH u.following WHERE u.username = :username")
Optional<User> findByUsernameWithFollowing(@Param("username") String username);
```

---

### 🔍 Detaillierte Analyse der Bestandteile

### 1. `LEFT JOIN` (Die Sicherheit)

- **Was es macht:** Es klebt die `User`Tabelle und die `Follower`Informationen aus der Zwischentabelle zusammen.
- **Warum "LEFT"?** Ein normaler Join würde den User löschen, wenn er keine Follower hat (da rechts keine Treffer sind). Der `LEFT JOIN` garantiert: Der User ("Links") bleibt immer bestehen, auch wenn die Liste ("Rechts") leer ist.

### 2. `FETCH` (Der n+1 Killer)

- **Das Problem:** Ohne `FETCH` würde JPA zwar joinen, aber die Daten nicht in das Java-Objekt übertragen. Die Liste bliebe `LAZY`.
- **Die Lösung:** `FETCH` sagt JPA: *"Nimm die Daten aus dem Join und fülle SOFORT das Set im User-Objekt."*
- **Ergebnis:** 1 SQL-Query statt 1 + 50 Stück.

---

### ↔️ Der Richtungs-Check (Antwort auf die Frage)

Je nachdem, welches Feld wir "fetchen", ändert sich der Inhalt unserer Liste:

| **Query-Ziel** | **Rechte Seite der "Super-Tabelle"** | **Ergebnis in Java** |
| --- | --- | --- |
| `u.followers` | Alle IDs, die **mich** abonniert haben. | `user.getFollowers()` ist filled. |
| `u.following`  | Alle IDs von Usern, die **ich** abonniert habe. | `user.getFollowing()` ist filled. |

---

### 💡 Notion Merksatz (Callout)

> **Aha-Moment: Warum zwei Queries?**
> 
> 
> Man trennt diese Queries, um Speicher zu sparen. Wenn der User nur seinen "Follower"-Tab öffnet, müssen wir nicht auch noch die 500 Leute laden, denen er selbst folgt. Wir laden nur das, was gerade sichtbar sein muss.
> 

# Der Massen-Status-Check (`IN`Query)

### 🚀 Das Problem

Wenn wir eine Liste von 50 Followern anzeigen, wollen wir bei jedem User wissen: *"Folge ich diesem User bereits?"* (um das "Following"-Badge anzuzeigen).

- **Der schlechte Weg:** 50-mal einzeln in der Datenbank nachfragen → **50 Requests (n+1 Problem)**.
- **Der Profi-Weg:** Alle 50 IDs in ein Paket packen und **eine einzige** Frage an die Datenbank stellen.

---

### 💻 Der Code (Repository)

```java
@Query("SELECT f.id FROM User u JOIN u.following f WHERE u.id = :myId AND f.id IN :targetIds")
Set<UUID> findFollowingIdsIn(
    @Param("myId") UUID myId, 
    @Param("targetIds") Set<UUID> targetIds
);
```

---

### 🔍 Schritt-für-Schritt Erklärung

1. **`SELECT f.id`**: Wir lassen uns **nur die IDs** zurückgeben. Wir brauchen nicht die kompletten User-Objekte (Namen, Bilder, Bio), da wir nur wissen wollen, ob die Verbindung existiert. Das spart massiv Arbeitsspeicher und Bandbreite.
2. **`JOIN u.following f`**: Wir öffnen meine eigene Liste von Leuten, denen ich folge.
3. **`u.id = :myId`**: Wir stellen sicher, dass wir in **meiner** Liste suchen (der eingeloggte User).
4. **`f.id IN :targetIds`**: Das Herzstück. Wir prüfen meine gesamte Following-Liste gegen das Paket von 50 IDs (`targetIds`), die wir gerade im Frontend anzeigen wollen.

# 🕵️‍♂️ Der Existenz-Check (`SELECT COUNT > 0`)

### 🚀 Das Szenario

Wenn wir das Profil eines Users (z.B. "Max") besuchen, müssen wir wissen, ob **wir selbst** (z.B. "Lea") ihm bereits folgen. Davon hängt ab, ob der Button im Frontend **"Folgen"** oder **"Gefolgt"** anzeigt.

---

### 💻 Die Query (Repository)

```java
@Query("SELECT COUNT(u) > 0 FROM User u JOIN u.followers f WHERE u.username = :targetUsername AND f.id = :userId")
boolean isUserFollowingTarget(
    @Param("targetUsername") String targetUsername, 
    @Param("userId") UUID userId
);
```

---

### 🔍 Schritt-für-Schritt Erklärung

1. **`FROM User u JOIN u.followers f`**:
Die Datenbank nimmt den Ziel-User `u` (Max) und "joint" seine Follower-Liste `f`. Intern entstehen dadurch Zeilen für jeden einzelnen Follower, den Max hat.
2. **`WHERE u.username = :targetUsername AND f.id = :userId`**:
Hier wird der Filter gesetzt. Die Datenbank sucht in der Liste der Follower (`f`) genau nach der ID von Lea (`userId`).
3. **`SELECT COUNT(u) > 0`**:
    - Wenn Lea in der Liste von Max gefunden wird, zählt die Datenbank `1`.
    - Die Logik `1 > 0` ergibt **`true`**.
    - Wenn Lea nicht gefunden wird, ist der Count `0`. Die Logik `0 > 0` ergibt **`false`**.

---

### 💡 Warum `COUNT` statt den User zu laden?

- **Leistung:** Würden wir den ganzen User mit `JOIN FETCH` laden, müsste die Datenbank alle Profil-Daten, Bio, Avatare etc. in den Speicher schaufeln.
- **Effizienz:** Der `COUNT`Check findet nur im Index der Datenbank statt. Die Datenbank muss kein einziges "schweres" Objekt anfassen. Sie schaut nur in die Liste der IDs und gibt ein winziges `true` oder `false` zurück.

# 🏆 Master-Sytax: Follower-Liste mit Status-Badges

### 📖 Das Szenario

- **Lea** (Eingeloggt) besucht das Profil von **Max**.
- Lea klickt auf **"Followers"** von Max.
- In der Liste der Follower von Max taucht **Lisa** auf.
- **Die Mission:** Das Backend muss blitzschnell herausfinden: *"Folgt Lea der Lisa?"* und *"Folgt Lisa der Lea?"*, um die richtigen Buttons/Badges anzuzeigen.

---

### 1. Der Controller-Einstieg

Der Request kommt bei `/followers/max` an.

```java
@GetMapping(path = "/followers/{username}")
public ResponseEntity<List<FollowDto>> getFollowers(...) {
    // 1. Alle Follower von Max laden (Lisa ist dabei)
    Set<User> followers = userService.getFollowers(username); 
    
    // 2. Den Status-Check für die Liste starten
    List<FollowDto> followersDto = handleFollowBadges(userId, followers);
    
    return ResponseEntity.ok(followersDto);
}
```

---

### 2. Die Turbo-Methode: `handleFollowBadges`

Diese Methode verhindert, dass wir für jeden User in der Liste einzeln die Datenbank fragen müssen.

```java
private List<FollowDto> handleFollowBadges(UUID userId, Set<User> users) {
    // A. IDs sammeln: [ID_Lisa, ID_Bob, ID_Tim]
    Set<UUID> idsInList = users.stream().map(User::getId).collect(Collectors.toSet());

    // B. Massen-Check (IN-Query): "Wen davon abonniere ich (Lea)?"
    Set<UUID> followedByMe = userService.findFollowingIdsIn(userId, idsInList);

    // C. DTOs markieren
    List<FollowDto> dtos = followMapper.toDtoList(users);
    dtos.forEach(dto -> {
        // Wenn Lisa in 'followedByMe' ist -> Badge "Folge ich" = true
        dto.setUserFollowingTarget(followedByMe.contains(dto.getId()));
    });
    return dtos;
}
```

---

### 3. Die "Scharfe" Query: `findFollowingIdsIn`

Hier wird das `IN`-Keyword zum Performance-Wunder.

```java
@Query("SELECT f.id FROM User u JOIN u.following f WHERE u.id = :myId AND f.id IN :targetIds")
Set<UUID> findFollowingIdsIn(@Param("myId") UUID myId, @Param("targetIds") Set<UUID> targetIds);
```

### 🔍 Was passiert hier Schritt für Schritt?

1. **`FROM User u WHERE u.id = :myId`**: Die DB fokussiert sich nur auf **Lea**.
2. **`JOIN u.following f`**: Die DB klappt Leas gesamte Liste von Abos auf (z. B. 200 Leute).
3. **`f.id IN :targetIds`**: Die DB prüft diese 200 Leute gegen das 3er-Paket `[Lisa, Bob, Tim]`.
4. **`SELECT f.id`**: Da **Lisa** in beiden Listen ist, "fällt" ihre ID durch das Sieb.
5. **Ergebnis**: JPA schickt ein `Set<UUID>` zurück, das nur die `ID_Lisa` enthält.

---

### 💡 Warum ist das so effizient? (Der Recap)

| **Ebene** | **Technik** | **Vorteil** |
| --- | --- | --- |
| **Datenbank** | `SELECT f.id` | Nur winzige UUIDs werden übertragen, keine schweren User-Objekte. |
| **Netzwerk** | `IN (...)` | Statt 50 Fragen stellen wir nur **eine** Sammelfrage an die DB. |
| **Java** | `HashSet.contains` | Der Abgleich im Speicher dauert dank Hash-Logik nur **O(1)** (Millisekunden). |

---

### 📝 Zusammenfassendes Beispiel: Lisa

- Lisa ist ein Follower von **Max**.
- Lea schaut die Liste an.
- Die Query findet Lisa in Leas **Following-Liste**.
- Das DTO für Lisa bekommt `userFollowingTarget = true`.
- **Ergebnis im Frontend:** Neben Lisa steht ein schöner blauer Button: **"Following"**.
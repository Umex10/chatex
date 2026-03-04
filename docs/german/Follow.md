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

### 1. Semantik & Performance

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

### Was würde ohne diese Einstellung passieren?

Lombok würde versuchen, den `hashCode` der gesamten `User`-Instanz zu berechnen. Da der User zwei `Set<User>`-Felder hat, müsste Lombok für jeden User darin ebenfalls einen `hashCode` berechnen – und so weiter, rekursiv. Das endet in einem **StackOverflow**.

Dieses bekannte Problem nennt sich das **Circular Reference Issue**.
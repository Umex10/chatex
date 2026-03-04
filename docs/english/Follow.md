# Chatex – Follow M:N

[Chatex_follow_m_n_cleaned](https://www.notion.so/Chatex_follow_m_n_cleaned-3194e760adb380b79eabf0444b31e8a9?pvs=21)

## What is a M:N relationship?

A M:N relationship is normally described through a **new junction table**. The classic example: a student attends many subjects, and a subject has many students – that is a M:N relationship.

In our social media system we need this relationship as well, because a user can take on **two roles** simultaneously:

- **Role A (Following):** A user can follow **many** other users.
- **Role B (Follower):** A user can be followed by **many** other users.

---

## What does the junction table contain?

The junction table describes the **action itself**: *"User A follows User B"*. You can therefore read this table from two directions.

**Example:**

| follower_id | following_id |
| --- | --- |
| 1 (Max) | 2 (Lisa) |
| 1 (Max) | 3 (Kevin) |
| 2 (Lisa) | 1 (Max) |

**What do we read from this?**

- **Rows 1 & 2:** Max (1) follows two people (Lisa and Kevin). He therefore has **2 followings**.
- **Rows 1 & 3:** Lisa (2) is followed by Max and also follows Max herself. She has **1 follower** (Max) and **1 following** (Max).
- **Row 2:** Kevin (3) is followed by Max. He has **1 follower**, but does not follow anyone himself.

> 💡 **Important:** The key difference compared to a classic example like "students & subjects" is that our follow system is a **self-referencing M:N relationship**. The relationship goes from the user to the junction table – and then back to the user again.
> 

---

## The Reference

- With a M:N relationship, the `User` table needs **no direct reference** to the junction table. In DB Beaver you can still see the junction table with its entries.
- M:N is **LAZY** by default. This means: if I request a user and do not explicitly call e.g. `getFollowers()`, the followers will **not be loaded**.

---

## Java: How do you implement the follow system?

We start in the `User` entity and define two fields: `following` and `followers`.

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

## Why a `Set` and not a `List`?

### 1. Semantics & Performance

- A `List` would in the worst case **traverse the entire list** to find a user → `O(n)`.
- A `Set` works together with `hashCode` and `equals` → **O(1)**.

### 2. No ordering required

- A `List` is always ordered. SQL would internally maintain an index list – but when it comes to "followers", an ordering is completely irrelevant. We only care about: *Is a user contained in the list? Yes or no?*

### 3. No duplicates allowed

- A user may only follow another user **once**. A list in which a user can appear twice would therefore be semantically wrong.

---

## How does a `Set` work together with `equals` and `hashCode`?

### The idea

1. Using `hashCode`, Java calculates an **address** (a "drawer") in which the instance is stored. This allows Java to find it again in O(1).
2. Multiple instances can end up in the same drawer if they have the same `hashCode` – Java then manages them internally as a list. This case is called a **collision**.
3. To decide in the event of a collision whether two instances are **truly equal**, Java uses the `equals` method.
4. Through `equals`, the `Set` guarantees that **no duplicates** are contained.

> 🧠 **The equals/hashCode rule as an analogy:**
> 
> 
> If you meet two people who are **siblings** (`equals == true`), you immediately know: they both have the last name "Miller" (`hashCode` is the same).
> 
> But: if two people both have the last name "Miller" (`hashCode` is the same), that does not mean they are siblings – they might just happen to share the same name. → That is a **collision**.
> 

---

## The `Set` in our social media app with Lombok

In a Spring Boot app we use Lombok with annotations like `@Data`, `@Getter` – and also `@EqualsAndHashCode`.

Since the `Set` absolutely depends on `equals` and `hashCode`, we need a **special setting**:

```java
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @EqualsAndHashCode.Include
    private UUID id;
}
```

With `onlyExplicitlyIncluded = true` we tell Lombok: *"Only include fields that are explicitly marked with `@EqualsAndHashCode.Include`."* In our case that is only the `id`, since it is the unique identifier of the user.

### What would happen without this setting?

Lombok would try to calculate the `hashCode` of the entire `User` instance. Since the user has two `Set<User>` fields, Lombok would also have to calculate a `hashCode` for every user within them – and so on, recursively. This ends in a **StackOverflow**.

This well-known problem is called the **Circular Reference Issue**.

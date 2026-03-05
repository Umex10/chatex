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

1. Using `hashCode`, Java calculates an **address** (a "bucket") in which the instance is stored. This allows Java to find it again in O(1).
2. Multiple instances can end up in the same bucket if they have the same `hashCode` – Java then manages them internally as a list. This case is called a **collision**.
3. To decide in the event of a collision whether two instances are **truly equal**, Java uses the `equals` method.
4. Through `equals`, the `Set` guarantees that **no duplicates** are contained.

> 🧠 **The equals/hashCode rule as an analogy:**
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

# 📘 Note: Self-Referencing Many-to-Many in JPA

---

## 🚀 The Scenario

A user can follow many users (**Following**) and be subscribed to by many users (**Followers**). Since both sides of the relationship are of type `User`, this is a **self-referencing M:N relationship**.

---

## 💻 The Code

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

## 🔍 Step-by-Step Explanation

### 1. Why `Set<User>`?

- **No duplicates:** A user cannot follow you twice.
- **Performance:** A `HashSet` works with O(1) lookup time. Thanks to `hashCode()`, Java immediately finds the right bucket and checks with `equals()` whether the ID matches.

---

### 2. The "Owner" of the relationship (`following`)

The `following` field is the **owner** of the relationship. Only this field determines what gets written to the database.

| Annotation | Meaning |
| --- | --- |
| `@JoinTable` | Creates the physical junction table `user_follows` |
| `joinColumns` | The **"anchor"** – stores the ID of the user who owns the list (the follower) |
| `inverseJoinColumns` | The **"arrow"** – stores the ID of the user being added to the list (the following target) |

---

### 3. The "mirror side" (`followers`)

The `followers` field is the **passive side** of the relationship.

> 💡 **`mappedBy = "following"`** is the signpost. It tells JPA:
> *"I have no blueprint of my own. Just look at the `following` field to find out how we are connected."*
>
- **Bidirectionality:** Without this field we could ask *"Who does Max follow?"*, but not *"Who follows Max?"*. The annotation makes the relationship readable from **both sides** in Java.

# 📘 Note: JPA Joins & Fetching (Follower vs. Following)

### 🚀 The Principle

Since our follower relationship is `LAZY`, JPA would normally leave the lists empty when loading a user. To avoid the **n+1 problem**, we use **JPQL** with the `JOIN FETCH` command.

---

### 💻 The Queries Compared

```java
// 1. The "Who follows me?" query
@Query("SELECT u FROM User u LEFT JOIN FETCH u.followers WHERE u.username = :username")
Optional<User> findByUsernameWithFollowers(@Param("username") String username);

// 2. The "Who do I follow?" query
@Query("SELECT u FROM User u LEFT JOIN FETCH u.following WHERE u.username = :username")
Optional<User> findByUsernameWithFollowing(@Param("username") String username);
```

---

### 🔍 Detailed Analysis of the Components

### 1. `LEFT JOIN` (The safety net)

- **What it does:** It joins the `User` table and the follower information from the junction table together.
- **Why "LEFT"?** A regular join would drop the user if they have no followers (since there are no matches on the right). The `LEFT JOIN` guarantees: the user ("left") always stays, even if the list ("right") is empty.

### 2. `FETCH` (The n+1 killer)

- **The problem:** Without `FETCH`, JPA would join but not transfer the data into the Java object. The list would remain `LAZY`.
- **The solution:** `FETCH` tells JPA: *"Take the data from the join and IMMEDIATELY populate the Set in the user object."*
- **Result:** 1 SQL query instead of 1 + 50.

---

### ↔️ The Direction Check

Depending on which field we "fetch", the content of our list changes:

| **Query target** | **Right side of the "super-table"** | **Result in Java** |
| --- | --- | --- |
| `u.followers` | All IDs that have **subscribed to me**. | `user.getFollowers()` is filled. |
| `u.following` | All IDs of users that **I have subscribed to**. | `user.getFollowing()` is filled. |

---

### 💡 Key Insight

> **Aha moment: Why two queries?**
>
> The queries are separated to save memory. If the user only opens their "Followers" tab, we do not need to also load the 500 people they follow themselves. We only load what needs to be visible right now.
>

# The Mass Status Check (`IN` Query)

### 🚀 The Problem

When we display a list of 50 followers, we want to know for each user: *"Am I already following this user?"* (to show the "Following" badge).

- **The bad way:** Query the database 50 times individually → **50 requests (n+1 problem)**.
- **The pro way:** Pack all 50 IDs into one package and ask the database **one single** question.

---

### 💻 The Code (Repository)

```java
@Query("SELECT f.id FROM User u JOIN u.following f WHERE u.id = :myId AND f.id IN :targetIds")
Set<UUID> findFollowingIdsIn(
    @Param("myId") UUID myId,
    @Param("targetIds") Set<UUID> targetIds
);
```

---

### 🔍 Step-by-Step Explanation

1. **`SELECT f.id`**: We only get **the IDs** back. We don't need the complete user objects (names, images, bio), since we only want to know whether the connection exists. This saves massive amounts of memory and bandwidth.
2. **`JOIN u.following f`**: We open my own list of people I follow.
3. **`u.id = :myId`**: We make sure we are searching in **my** list (the logged-in user).
4. **`f.id IN :targetIds`**: The core. We check my entire following list against the package of 50 IDs (`targetIds`) that we want to display in the frontend.

# 🕵️‍♂️ The Existence Check (`SELECT COUNT > 0`)

### 🚀 The Scenario

When we visit a user's profile (e.g. "Max"), we need to know whether **we ourselves** (e.g. "Lea") are already following them. This determines whether the button in the frontend shows **"Follow"** or **"Following"**.

---

### 💻 The Query (Repository)

```java
@Query("SELECT COUNT(u) > 0 FROM User u JOIN u.followers f WHERE u.username = :targetUsername AND f.id = :userId")
boolean isUserFollowingTarget(
    @Param("targetUsername") String targetUsername,
    @Param("userId") UUID userId
);
```

---

### 🔍 Step-by-Step Explanation

1. **`FROM User u JOIN u.followers f`**:
The database takes the target user `u` (Max) and "joins" their follower list `f`. This internally creates rows for every single follower Max has.
2. **`WHERE u.username = :targetUsername AND f.id = :userId`**:
Here the filter is applied. The database searches the follower list (`f`) for exactly Lea's ID (`userId`).
3. **`SELECT COUNT(u) > 0`**:
    - If Lea is found in Max's list, the database counts `1`.
    - The logic `1 > 0` results in **`true`**.
    - If Lea is not found, the count is `0`. The logic `0 > 0` results in **`false`**.

---

### 💡 Why `COUNT` instead of loading the user?

- **Performance:** If we loaded the whole user with `JOIN FETCH`, the database would have to shovel all profile data, bio, avatars etc. into memory.
- **Efficiency:** The `COUNT` check takes place only in the database index. The database does not have to touch a single "heavy" object. It simply looks into the list of IDs and returns a tiny `true` or `false`.

# 🏆 Master Syntax: Follower List with Status Badges

### 📖 The Scenario

- **Lea** (logged in) visits **Max**'s profile.
- Lea clicks on Max's **"Followers"**.
- **Lisa** appears in the list of Max's followers.
- **The mission:** The backend must quickly determine: *"Does Lea follow Lisa?"* and *"Does Lisa follow Lea?"*, in order to display the correct buttons/badges.

---

### 1. The Controller Entry Point

The request arrives at `/followers/max`.

```java
@GetMapping(path = "/followers/{username}")
public ResponseEntity<List<FollowDto>> getFollowers(...) {
    // 1. Load all followers of Max (Lisa is among them)
    Set<User> followers = userService.getFollowers(username);

    // 2. Start the status check for the list
    List<FollowDto> followersDto = handleFollowBadges(userId, followers);

    return ResponseEntity.ok(followersDto);
}
```

---

### 2. The Turbo Method: `handleFollowBadges`

This method prevents us from having to query the database individually for each user in the list.

```java
private List<FollowDto> handleFollowBadges(UUID userId, Set<User> users) {
    // A. Collect IDs: [ID_Lisa, ID_Bob, ID_Tim]
    Set<UUID> idsInList = users.stream().map(User::getId).collect(Collectors.toSet());

    // B. Mass check (IN query): "Which of these do I (Lea) follow?"
    Set<UUID> followedByMe = userService.findFollowingIdsIn(userId, idsInList);

    // C. Mark DTOs
    List<FollowDto> dtos = followMapper.toDtoList(users);
    dtos.forEach(dto -> {
        // If Lisa is in 'followedByMe' -> badge "I follow" = true
        dto.setUserFollowingTarget(followedByMe.contains(dto.getId()));
    });
    return dtos;
}
```

---

### 3. The Sharp Query: `findFollowingIdsIn`

Here the `IN` keyword becomes a performance marvel.

```java
@Query("SELECT f.id FROM User u JOIN u.following f WHERE u.id = :myId AND f.id IN :targetIds")
Set<UUID> findFollowingIdsIn(@Param("myId") UUID myId, @Param("targetIds") Set<UUID> targetIds);
```

### 🔍 What happens step by step?

1. **`FROM User u WHERE u.id = :myId`**: The DB focuses only on **Lea**.
2. **`JOIN u.following f`**: The DB unfolds Lea's entire subscription list (e.g. 200 people).
3. **`f.id IN :targetIds`**: The DB checks these 200 people against the 3-pack `[Lisa, Bob, Tim]`.
4. **`SELECT f.id`**: Since **Lisa** is in both lists, her ID "falls through the sieve".
5. **Result**: JPA returns a `Set<UUID>` containing only `ID_Lisa`.

---

### 💡 Why is this so efficient? (The Recap)

| **Level** | **Technique** | **Advantage** |
| --- | --- | --- |
| **Database** | `SELECT f.id` | Only tiny UUIDs are transferred, no heavy user objects. |
| **Network** | `IN (...)` | Instead of 50 questions we ask only **one** batch query to the DB. |
| **Java** | `HashSet.contains` | The comparison in memory takes only **O(1)** thanks to hash logic. |

---

### 📝 Summary Example: Lisa

- Lisa is a follower of **Max**.
- Lea is viewing the list.
- The query finds Lisa in Lea's **following list**.
- The DTO for Lisa gets `userFollowingTarget = true`.
- **Result in the frontend:** Next to Lisa there is a nice blue button: **"Following"**.

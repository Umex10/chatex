# Security Filter Chain

## The Protected Request (Stateless Flow)

When a user performs an action that is only allowed for logged-in users, the following happens:

---

### 1️⃣ Backend - Entering the Security Filter Chain

The request arrives at the backend. Before it reaches the controller, it must pass through the **Security Filter Chain** — like a series of security checkpoints:

**The filters in the chain:**

- **CORS Filter:** First checks whether the request is coming from your allowed domain (`localhost:3000`)
- **CSRF Filter:** Since we set `sessionManagement` to **STATELESS**, this filter is disabled
- **My `JwtAuthenticationFilter`:** We placed this at a strategic position using `addFilterBefore` (before the `UsernamePasswordAuthenticationFilter`)

---

### 2️⃣ The JwtAuthenticationFilter (The Identity Check)

This is where the actual "magic" happens:

### 2.1 Extraction

The filter extracts the string from the `Authorization` header and removes the `"Bearer "` prefix.

---

### 2.2 Validation

The **JwtService** verifies the token's signature using the secret key. Is the token expired or tampered with?

**If invalid:**

- We do **not** throw an exception — we simply leave the SecurityContext empty

---

### 2.3 Loading UserDetails

If the token is valid, we load the user data (roles, ID) into a **`UserDetails`** object.

---

### 2.4 Populating the Context

- We create a **`UsernamePasswordAuthenticationToken`**
- This serves as our "verified ID card"
- We place it into the **`SecurityContextHolder`**

---

### 3️⃣ The Final Step in the Filter Chain (Authorization)

The request continues to the last filter, the **AuthorizationFilter**:

**What happens:**

1. It checks our **`SecurityConfig` rules** (`.anyRequest().authenticated()`)
2. It inspects the **`SecurityContextHolder`**
3. **Result:** Since our JWT filter previously placed a valid "ID card" there, this filter responds: **"Access granted!"** and forwards the request to the actual controller

---

### 4️⃣ Controller & Service

### Direct Access

In the controller, we can now access the user directly via **`@AuthenticationPrincipal`**.

### userId Shortcut

Since we used `request.setAttribute("userId", ...)` in the filter, the controller can read the user's ID without any detours.

### Processing

The service executes the business logic (e.g. sending a message) and returns the data.

---

## Summary of Architecture Components

| Component | Role in the Project |
| --- | --- |
| **`SecurityConfig`** | The control center. Defines which paths are public and which building blocks (manager, encoder) are needed. |
| **`JwtAuthenticationFilter`** | The "bouncer". The sole component responsible for reading the JWT and establishing the identity for the current request. |
| **`SecurityContextHolder`** | The temporary vault. Stores the identity only for the duration of a single request. |
| **`PasswordEncoder`** | Ensures that real passwords are never stored in the database — only secure hashes. |
| **`AuthenticationManager`** | The brain during login. Verifies the username/password once so we can issue the JWT afterward. |

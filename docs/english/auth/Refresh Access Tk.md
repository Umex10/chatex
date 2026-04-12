# Refresh & Access Token

## Scenarios

**General:** The middleware is triggered to check whether the Refresh Token is in the cookie or not. This happens before the user even sees the website. Middleware is a convention from Next.js.

---

### Scenario 1: The User Has No Refresh Token in the Cookie

---

#### Flow

#### 1️⃣ Middleware - Initial Check

**User wants to visit `/home`**

#### Case A: Refresh Token Available ✅

- We first check whether they have a Refresh Token
- If **yes**, then we let them through
- If this is the case, the **AuthProvider.tsx** is triggered, and we fetch the Access Token
- → This would then be **Scenario 2** as described further below

#### Case B: No Refresh Token ❌

- If **not**, then we redirect to the **Sign-in page**, where they must authenticate again

---

### Scenario 2: The User Has a Refresh Token as Cookie

If the user has authenticated and decides to surf the website again after several days, they would already have a Refresh Token. This may be used for 30 days, so my system then uses the Refresh Token and only builds the Access Token and sends it back to the client, so they don't have to log in again or anything. After 30 days, if the Refresh Token has expired, they would have to log in again.

---

#### Flow

#### 1️⃣ Main Website & Layout Initialization

This means, if you come to the main website, in this case e.g., `/home` URL – so if you are already authenticated – then you land in the **(appshell) Layout** of Next.js.

**Important to emphasize:**

- When you land in this layout, an **AuthProvider** is directly initialized
- This "wraps" the remaining code, so that the remaining code can always access the Access JWT
- We do this because the Access Token has no place in the layout before (where e.g., the Sign-in form is located)
- There we only need the Refresh Token

---

#### 2️⃣ Automatic Redirect & Request Trigger

This means, if the user has a Refresh Token in the cookie, they will be redirected immediately – even if they called up the Sign-in page.

**What happens:**

- They arrive e.g., at the `/home` URL
- We automatically trigger a request to fetch the Access Token

---

#### 3️⃣ AuthProvider - Fetching Access Token

The **AuthProvider** thus triggers the request, sends the Refresh Token to the backend and receives an Access Token back.

**The flow in detail:**

#### 3.1 AuthController - Extracting Refresh Token

In the **AuthController** we extract the Refresh Token from the request, since we are also allowed to access the cookies in the backend.

- So we first call `extractRefreshToken` in the controller to get the token and hold it

**Validation:**

- If the Refresh Token mistakenly has no value → we directly send an error message back
- If everything is in order → we go one step further

---

#### 3.2 Token Validation & Loading User

We now call `validateToken`.

**How JWT Tokens work in our system:**

- When we create a JWT Token, I add the username to the claims by default
- This means the `validateToken` method is structured so that we extract the username from the Refresh Token and then load the **UserDetails** with it
- We use the same **"signing-key"** that is located in the conf files

**Why do we need the "sub" field?**

- So when the Refresh Token arrives in the backend, the backend must know who sent the request
- It checks whether everything matches with the key, but without the **"sub" field** on the JWT Token itself, which is in the payload, the backend wouldn't know who the user currently is
- This allows us to fetch the user, who is very important in the next step

---

#### 3.3 Creating & Sending Back Access Token

If the token is then in order, it comes back to the **AuthController**.

**What happens:**

1. There we then call our method again to create the Access Token (as we did with Sign-in for example)
2. The Access Token again needs the username for the **"sub" field** in the token
3. Then we send it back to the client

---

#### 4️⃣ Client - RTK Cache

Having arrived at the client, we then return the data from the **Server Action** to the **RTK query call**.

**RTK Cache Mechanism:**

- When the `queryFn` receives a return, it writes the data it received into the **Redux Cache** that we defined in the store
- We say that the data is valid for **900 seconds**, until the middleware in the store deletes this data
- **Why 900 seconds?** Because the Access Token may only live **15 minutes** on my website

---

#### 5️⃣ Access Token in Header

The Access Token is now in the **RTK Cache**.

**Usage in the main RTK call:**

- We then prepare the header each time before a request goes out, where we set the Access Token
- So that e.g., **Shout** doesn't need to know how to get to the token
- It only sends its request quite normally
- But we always attach the Access Token to the header
- Which is then checked in the request in the **Security Filter Chain**

---

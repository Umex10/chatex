# Chatex - Auth

## General

### Flow

#### 1️⃣ Form & RTK Query

We extract the data from the register form or from the "Zod" form and send it to our RTK query.

---

#### 2️⃣ Next.js Action

Subsequently, we call a Next.js Action in the RTK query so that sensitive data like the Refresh Token is not displayed in the Dev Tools.

---

#### 3️⃣ Server-side Request

In the Action, we then send to the backend. More specifically, Next.js (server-side) sends to the backend.

> **The Key Point:** The browser does see this request in the Network tab, but not in detail. So it doesn't see exact data, etc. Which is ideal for the security of the entered data and what we get back – namely the Refresh Token.

---

#### 4️⃣ Backend - AuthController

The backend receives the request in the **AuthController**. This route is **not protected**, what I mean by this is that this route does not perform a check beforehand whether you have a JWT Token or not, since the user only gets this after successful registration/login.

We then forward the request from the AuthController to the **Service**.

---

## Registration

### 1️⃣ Service - Validation & Persistence

The Service receives it and checks again whether the user's inputs are valid. This means:

- **Username**
- **Email**
- **Phone Number**

are extracted and checked whether these unique data are not already taken, since a phone number, for example, must be unique.

**If everything passes:**

- No errors
- We encode the user's password
- Save the new entity in the database

**Should errors occur** (e.g., username is already taken):

- We throw an **"unchecked" error** in Java
- This is an error that does not need to be checked by the parent call
- This means: I don't need a `try-catch` block or a `throws` declaration
- Instead, we need a **central class** that catches such errors

**ErrorController:**

- Catches the errors
- Builds an error instance that we have also defined
- Sends this back to the client
- This creates tokens like `"username already taken"`
- The affected field in the form is also marked in red (for usability)

---

### 2️⃣ Token Creation in AuthController

If the fields were in order, it goes back to the **AuthController**, where the important part now happens.

We have a **non-public method** that does something extremely important. I created this method because multiple routes in the AuthController need to use the same logic.

**What happens:**

1. An **Access Token** is created
2. If you pass the Response object, a **Refresh Token** is also created
3. This is then placed on the Response object as `Set-Cookie`
4. The frontend is allowed to read it out to save it as a cookie in the browser
5. Finally, we send the Refresh and Access Token together back to the frontend

---

### 3️⃣ Action - Cookie-Handling & Redirect

The Action receives this, checks whether there are cookies at all, and passes it to the **non-public method** `setRefreshCookie`.

**In this process:**

- The cookie is read from the Response that the backend has set
- We set it in the browser as an **HTTP-only Cookie**

Finally, it goes back to the **RTK query** and thereby back to the form's `onSend()` method.

**If everything was correct:**

- As already mentioned, no "Error-Toasts" appear
- We have successfully completed it
- ✅ **We redirect the user**

---

## Login

### 1️⃣ AuthService - The Authentication Process

We are now in the **AuthController**. There we call our **AuthService**. In doing so, we use two important classes.

#### 1.1 AuthenticationManager

First: The **AuthenticationManager**, which is injected by Spring Boot. This is an interface and it is, so to speak, the "boss" of authentication to a user. However, it works internally with many other interfaces.

**We call the `authenticate()` method on the manager:**

- In doing so, we pass a specific instance so that the manager can internally decide which **AuthProvider** it now calls
- Since our users are in our database or in a database at all, we need the **DaoAuthenticationProvider**, which is capable of reading from a database
- We have also passed an arg to the manager beforehand, or a specific instance, which in turn expects username and key, which we have now received from the user because they want to log in

---

#### 1.2 DaoAuthenticationProvider - Loading User

The manager decides on the **DaoAuthenticationProvider** and uses it.

**In the next step:**

- This instance has the username and the "key", but it doesn't know what to do with it
- However, since it knows the username, it calls the method `loadUserByUsername(String username)` on a specific interface
- This is an interface provided directly by Spring Boot so that Spring Boot also knows in auth cases how to get the user from the DB or how to load the user from the DB

---

#### 1.3 UserDetailsService Implementation

We naturally implement this method and use our **Repository interface**, so Spring Boot or the provider knows how to get to the user.

**What happens:**

- It now has the username and key from the form
- But also the hashed key from the DB
- However, since the Security Layer only works with **UserDetails** and not the service of it (i.e., **UserDetailsService**), we wrap the user in the **UserDetails** and return it to the provider

---

#### 1.4 Password Comparison

The provider now has the user. It now calls `getPassword()` and gets the hashed key.

**Now it passes both to the PasswordEncoder:**

- The same one that we used for hashing the key during registration
- It knows best whether the two keys are the same and compares them

**Case 1: Keys do NOT match** ❌

- It returns to the **DaoAuthenticationProvider** with a Boolean value, i.e., `false`
- The **DaoProvider** throws a **BadCredentialsException**
- This exception inherits from the parent, i.e., **AuthenticationException**, and this is the central exception that is thrown when an error occurs during authentication
- We naturally handle this error in the **ErrorController**
- And send back to the client `"The credentials are incorrect"`
- Whereupon a toast is displayed on the client

---

#### 1.5 Creating Authentication Object

**Case 2: Keys match** ✅

If the encoder returns `true` (meaning the keys match), then the **DaoProvider** creates again the same instance that we passed in the manager.

**This involves:**

- The **Authentication** interface
- And the **UsernamePasswordAuthenticationToken** implements this
- The **Authentication** interface states that everyone must have a `getAuthorities()`
- And the **UsernamePasswordAuthenticationToken** has exactly that – in this case, it's an authentication with username and password

---

#### 1.6 Setting Authenticated Flag

This means we pass the manager a `new UsernamePasswordAuthenticationToken`, but there is a field that is set to `false` by default: This is the **"authenticated"** field.

**So if the encoder returns `true`:**

- Then the **DaoProvider** builds such an instance of the same class again
- And deletes the credentials in the process, since they no longer need to be in RAM
- And sets the **authenticated** field to `true`
- It returns this to the manager

**The manager** would theoretically also return the Authentication to the AuthService, but in this case we don't need to do it. Instead, it's enough for us to know that it went smoothly without a credentials error. Because we respond to the user afterwards anyway and the request ends with that. Normally, you could write the object to the **Security Context**.

---

### 2️⃣ AuthService - Returning UserDetails

Now we are through with the code and return the **UserDetails** in the **AuthService**.

So that in the subsequent course we again:

- Create an **Access Token**
- And create the **Refresh Token**

Then we set the **Refresh Cookie** on it and send it back to the client.

---

### 3️⃣ Action - Cookie-Handling & Redirect

The Action receives this, checks whether there are cookies at all, and passes it to the **non-public method** `setRefreshCookie`.

**In this process:**

- The cookie is read from the Response that the backend has set
- We set it in the browser as an **HTTP-only Cookie**

Finally, it goes back to the **RTK query** and thereby back to the form's `onSubmit()` method.

**If everything was correct:**

- As already mentioned, no "Error-Toasts" appear
- We have successfully completed it
- ✅ **We redirect the user**

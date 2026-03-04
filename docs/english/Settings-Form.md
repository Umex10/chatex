# Chatex E2E Settings

[nextjs-parallel-intercepting-routes](https://www.notion.so/nextjs-parallel-intercepting-routes-3194e760adb38008ad64c902f904c7a0?pvs=21)

[nextjs-parallel-intercepting-routes.md](Chatex%20E2E%20settings/nextjs-parallel-intercepting-routes.md)

# 🧩 Next.js: Parallel Routes & Intercepting Routes

> **Goal of this note:** Understand how `@modal` slots and `(.)intercepting` routes work together to open a modal over an existing page – without destroying the background.
> 

---

## 📁 Directory Structure (Setup)

```
app/
├── [username]/
│   ├── layout.tsx          ← The main layout with two slots
│   ├── page.tsx            ← Profile page (/max) → children slot
│   │
│   └── @modal/             ← Parallel Route Slot
│       ├── default.tsx     ← Empty (null) — rendered when no modal is active
│       └── (.)settings/
│           └── page.tsx    ← Intercepted modal version of /settings
│
└── (account)/
    └── settings/
        └── page.tsx        ← Real, dedicated settings page (full-page)
```

---

## 🚶 The User Flow Step by Step

### Step 1 — Normal visit: `/max`

The user opens Max's profile. Next.js renders:

| Slot | Content |
| --- | --- |
| `children` | `app/[username]/page.tsx` (profile page) |
| `@modal` | `app/[username]/@modal/default.tsx` → `null` (invisible) |

The layout sees **one** piece of content: the profile page.

---

### Step 2 — Click on "Edit Account"

```tsx
// Somewhere on the profile page
<Link href="/settings">Edit Account</Link>
```

The URL in the address bar changes to `/settings`.

---

### Step 3 — ✨ The Magic Moment: The Modal Appears

> 💡 **Aha moment #1: Why does a modal open instead of a new page?**
> 
> 
> Because `(.)settings` **intercepts** the route. Next.js recognises: *"This navigation originates from within an existing layout context – I'll fill the `@modal` slot instead!"*
> 

Next.js now renders **both slots simultaneously**:

| Slot | Content |
| --- | --- |
| `children` | `app/[username]/page.tsx` → Profile page **stays in place** ✅ |
| `@modal` | `app/[username]/@modal/(.)settings/page.tsx` → Modal opens |

The user sees: **profile page in the background + modal in the foreground.**

The URL still shows `/settings` – everything is deep-linkable.

---

### Step 4 — 🔄 The Refresh (F5 or sharing the link)

> 💡 **Aha moment #2: Why does a different page appear on refresh?**
> 
> 
> On reload there is **no navigation context** anymore. Next.js cannot intercept because there is no "previous route". It instead renders the **real** `/settings` route directly.
> 

| Situation | What gets rendered |
| --- | --- |
| Client-side navigation to `/settings` | Modal over profile page (intercepted) |
| Direct URL / F5 / shared link | `app/(account)/settings/page.tsx` → Full-page |

---

## ❓ The "Why" behind the Concepts

### Why do we need `@modal` (Parallel Routes)?

> 💡 **Aha moment #3**
> 
> 
> A normal layout has only **one** content slot (`children`). If we navigate to `/settings`, Next.js would replace the `children` slot – the profile page would be gone.
> 
> With `@modal` we create a **second, independent slot** in the same layout. The layout can now **render two things simultaneously**: the existing `children` content AND the modal.
> 

```tsx
// app/[username]/layout.tsx
export default function UserLayout({
  children,   // ← Slot 1: The profile page
  modal,      // ← Slot 2: The modal (comes from @modal/)
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}  {/* Renders null when no modal is active */}
    </>
  )
}
```

---

### Why isn't `@modal` alone enough?

> 💡 **Aha moment #4**
> 
> 
> Without intercepting, Next.js would **replace** the `children` slot with the settings page when navigating to `/settings`. The `@modal` slot would still exist, but `children` (the profile) would disappear.
> 
> `@modal` alone only gives us a second place in the layout – but it does **not** prevent Next.js from touching the first place (`children`).
> 

---

## 🔧 Technical Summary: What `(.)` Actually Does

The interceptor `(.)` is the real magic. It sends Next.js the following instruction:

```
"If someone navigates client-side to /settings and we are
 within the [username] layout:

  ✅ Change the URL to /settings
  ✅ Fill the @modal slot with my page.tsx
  🚫 Do NOT touch the children slot!
  🚫 Do NOT render the real app/(account)/settings/page.tsx"
```

**The `(.)` syntax in detail:**

| Syntax | Meaning |
| --- | --- |
| `(.)segment` | Intercept a route on **the same level** |
| `(..)segment` | Intercept a route **one level up** |
| `(...)segment` | Intercept from the **app root** |

---

## 🗂️ Summary: How Everything Works Together

```
Parallel Routes (@modal)    →  Creates space for two pieces of content simultaneously
Intercepting Routes ((.).)  →  Determines WHAT gets rendered in that space
                               (and protects the rest of the layout)
```

> 🏆 **The result:**
> 
> 
> A UX pattern like on Twitter/X (photo opens modal → F5 shows photo detail page), Instagram or GitHub – fully implemented with the Next.js App Router, without any external modal library.
> 

---

## 📎 Relevant Files at a Glance

| File | Purpose |
| --- | --- |
| `app/[username]/layout.tsx` | Layout with `children` + `modal` props |
| `app/[username]/page.tsx` | Profile page (normal `children` slot) |
| `app/[username]/@modal/default.tsx` | Empty fallback (`return null`) |
| `app/[username]/@modal/(.)settings/page.tsx` | Modal version of settings |
| `app/(account)/settings/page.tsx` | Full-page settings (refresh / direct link) |

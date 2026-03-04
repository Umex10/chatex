# Chatex E2E settings

[nextjs-parallel-intercepting-routes](https://www.notion.so/nextjs-parallel-intercepting-routes-3194e760adb38008ad64c902f904c7a0?pvs=21)

[nextjs-parallel-intercepting-routes.md](Chatex%20E2E%20settings/nextjs-parallel-intercepting-routes.md)

# 🧩 Next.js: aralel Routes & Intercepting Routes

> **Ziel dieser Notiz:** Verstehen, wie `@modal`-Slots und `(.)intercepting`-Routes zusammenarbeiten, um ein Modal über einer bestehenden Seite zu öffnen – ohne den Hintergrund zu zerstören.
> 

---

## 📁 Verzeichnisstruktur (Setup)

```
app/
├── [username]/
│   ├── layout.tsx          ← Das Haupt-Layout mit zwei Slots
│   ├── page.tsx            ← Profilseite (/max) → children-Slot
│   │
│   └── @modal/             ← Parallel Route Slot
│       ├── default.tsx     ← Leer (null) — wird gerendert wenn kein Modal aktiv
│       └── (.)settings/
│           └── page.tsx    ← Intercepted Modal-Version von /settings
│
└── (account)/
    └── settings/
        └── page.tsx        ← Echte, dedizierte Einstellungsseite (Full-page)
```

---

## 🚶 Der User-Flow Schritt für Schritt

### Schritt 1 — Normaler Besuch: `/max`

Der User öffnet das Profil von Max. Next.js rendert:

| Slot | Inhalt |
| --- | --- |
| `children` | `app/[username]/page.tsx` (Profilseite) |
| `@modal` | `app/[username]/@modal/default.tsx` → `null` (unsichtbar) |

Das Layout sieht **einen** Inhalt: die Profilseite.

---

### Schritt 2 — Klick auf „Account bearbeiten”

```tsx
// Irgendwo in der Profilseite
<Link href="/settings">Account bearbeiten</Link>
```

Die URL in der Adressleiste wechselt zu `/settings`.

---

### Schritt 3 — ✨ Der Magic Moment: Das Modal erscheint

> 💡 **Aha-Moment #1: Warum öffnet sich ein Modal statt einer neuen Seite?**
> 
> 
> Weil `(.)settings` die Route **interceptet**. Next.js erkennt: *„Diese Navigation kommt aus einem bestehenden Layout-Kontext heraus – ich fülle stattdessen den `@modal`-Slot!“*
> 

Next.js rendert jetzt **beide Slots gleichzeitig**:

| Slot | Inhalt |
| --- | --- |
| `children` | `app/[username]/page.tsx` → Profilseite **bleibt stehen** ✅ |
| `@modal` | `app/[username]/@modal/(.)settings/page.tsx` → Modal öffnet sich |

Der User sieht: **Profilseite im Hintergrund + Modal im Vordergrund.**

Die URL zeigt trotzdem `/settings` – alles ist deep-linkbar.

---

### Schritt 4 — 🔄 Der Refresh (F5 oder Link teilen)

> 💡 **Aha-Moment #2: Warum erscheint beim Refresh eine andere Seite?**
> 
> 
> Beim Neuladen gibt es **keinen Navigations-Kontext** mehr. Next.js kann nicht intercepten, weil es keine „vorherige Route” gibt. Es rendert stattdessen die **echte** `/settings`-Route direkt.
> 

| Situation | Was gerendert wird |
| --- | --- |
| Client-side Navigation zu `/settings` | Modal über Profilseite (intercepted) |
| Direktaufruf / F5 / geteilter Link | `app/(account)/settings/page.tsx` → Full-page |

---

## ❓ Das „Warum” hinter den Konzepten

### Warum brauchen wir `@modal` (Parallel Routes)?

> 💡 **Aha-Moment #3**
> 
> 
> Ein normales Layout hat nur **einen** Inhalts-Slot (`children`). Wenn wir zu `/settings` navigieren, würde Next.js den `children`-Slot ersetzen – die Profilseite wäre weg.
> 
> Mit `@modal` schaffen wir einen **zweiten, unabhängigen Slot** im selben Layout. Das Layout kann jetzt **zwei Dinge gleichzeitig rendern**: den bestehenden `children`-Inhalt UND das Modal.
> 

```tsx
// app/[username]/layout.tsx
export default function UserLayout({
  children,   // ← Slot 1: Die Profilseite
  modal,      // ← Slot 2: Das Modal (kommt aus @modal/)
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <>
      {children}
      {modal}  {/* Rendert null wenn kein Modal aktiv */}
    </>
  )
}
```

---

### Warum reicht `@modal` allein nicht?

> 💡 **Aha-Moment #4**
> 
> 
> Ohne Intercepting würde Next.js bei einer Navigation zu `/settings` den `children`-Slot mit der Einstellungsseite **überschreiben**. Der `@modal`-Slot wäre zwar vorhanden, aber `children` (das Profil) würde verschwinden.
> 
> `@modal` allein gibt uns nur einen zweiten Platz im Layout – aber es verhindert **nicht**, dass Next.js den ersten Platz (`children`) anfasst.
> 

---

## 🔧 Technisches Fazit: Was `(.)` wirklich macht

Der Interceptor `(.)` ist die eigentliche Magie. Er sendet Next.js folgende Anweisung:

```
„Wenn jemand client-seitig zu /settings navigiert und wir uns
 im [username]-Layout befinden:

  ✅ Ändere die URL auf /settings
  ✅ Fülle den @modal-Slot mit meiner page.tsx
  🚫 Fass den children-Slot NICHT an!
  🚫 Rendere NICHT die echte app/(account)/settings/page.tsx"
```

**Die `(.)`-Syntax im Detail:**

| Syntax | Bedeutet |
| --- | --- |
| `(.)segment` | Intercepte eine Route auf **derselben Ebene** |
| `(..)segment` | Intercepte eine Route **eine Ebene höher** |
| `(...)segment` | Intercepte vom **App-Root** aus |

---

## 🗂️ Zusammenfassung: Das Zusammenspiel

```
Parallel Routes (@modal)    →  Schafft Platz für zwei Inhalte gleichzeitig
Intercepting Routes ((.).)  →  Bestimmt, WAS in diesen Platz gerendert wird
                               (und schützt den Rest des Layouts)
```

> 🏆 **Das Ergebnis:**
> 
> 
> Ein UX-Pattern wie auf Twitter/X (Foto öffnet Modal → F5 zeigt Foto-Detailseite), Instagram oder GitHub – vollständig mit dem Next.js App Router, ohne externe Modal-Bibliothek.
> 

---

## 📎 Relevante Dateien auf einen Blick

| Datei | Zweck |
| --- | --- |
| `app/[username]/layout.tsx` | Layout mit `children` + `modal`-Props |
| `app/[username]/page.tsx` | Profilseite (normaler `children`-Slot) |
| `app/[username]/@modal/default.tsx` | Leerer Fallback (`return null`) |
| `app/[username]/@modal/(.)settings/page.tsx` | Modal-Version der Settings |
| `app/(account)/settings/page.tsx` | Full-page Settings (Refresh / Direktlink) |
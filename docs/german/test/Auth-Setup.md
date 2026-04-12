# Chatex -- E2E Authentication Setup

## 🎯 Ziel

Um den **Sign-up- und Sign-in-Flow** zuverlässig zu testen, benötigen
wir zunächst dedizierte Authentifizierungs-Tests.

Diese prüfen:

-   ✅ Erfolgreiche Registrierung\
-   ❌ Fehlgeschlagene Registrierung\
-   ✅ Erfolgreiche Anmeldung\
-   ❌ Fehlgeschlagene Anmeldung

Dafür erstellen wir eine Datei:

    auth.spec.ts

------------------------------------------------------------------------

# 1️⃣ Auth Flow Tests (`auth.spec.ts`)

Beispiel: **Successful Sign-up**

``` ts
test('Successful Sign-up', async ({ page, baseURL, browserName }) => {
  const { username, email, phone, key } = getTestData(browserName, "unique");

  await expect(page).toHaveURL(`${baseURL}/`);
  const signUpButton = page.getByTestId("sign-up-button");
  await signUpButton.click();

  await page.waitForSelector('[role="dialog"]');

  await page.getByTestId("name").fill("Test User");
  await page.getByTestId("username").fill(username);
  await page.getByTestId("email").fill(email);
  await page.getByTestId("phone").fill(phone);
  await page.getByTestId("key").fill(key);
  await page.getByTestId("keyConfirm").fill(key);

  const createAccountButton = page.getByTestId("create-account-button");
  await expect(createAccountButton).not.toBeDisabled({ timeout: 7000 });
  await createAccountButton.click();

  await page.waitForURL(`${baseURL}/home`, { timeout: 15000 });
  await expect(page).toHaveURL(`${baseURL}/home`);

  const successToast = page.locator('.toast-success');
  await expect(successToast).toBeVisible({ timeout: 5000 });
});
```

------------------------------------------------------------------------

## ❓ Problem

Wie erhalten **alle weiteren Tests** Zugriff auf einen bereits
eingeloggten User?

Wir wollen vermeiden, dass:

-   Jeder Test erneut einen User registriert\
-   Tests unnötig lange dauern\
-   Es zu Datenkollisionen kommt

Dafür benötigen wir ein **dediziertes Auth-Setup**, das einmal
ausgeführt wird und anschließend von allen Tests verwendet wird.

------------------------------------------------------------------------

# 2️⃣ Playwright Konfiguration (`playwright.config.ts`)

Wir definieren drei Test-Bereiche:

1.  Auth Tests\
2.  Auth Setup\
3.  Feature Tests

------------------------------------------------------------------------

## 🔹 2.1 Auth Tests

``` ts
{
  name: 'auth-tests-chromium',
  testMatch: /auth\.spec\.ts/,
  use: { ...devices['Desktop Chrome'] },
},
{
  name: 'auth-tests-webkit',
  testMatch: /auth\.spec\.ts/,
  use: { ...devices['Desktop Safari'] },
},
```

------------------------------------------------------------------------

## 🔹 2.2 Auth Setup

``` ts
{
  name: 'auth-initial-chromium',
  testMatch: /auth\.setup\.ts/,
  use: { ...devices['Desktop Chrome'] },
  dependencies: ['auth-tests-chromium'],
},
{
  name: 'auth-initial-webkit',
  testMatch: /auth\.setup\.ts/,
  use: { ...devices['Desktop Safari'] },
  dependencies: ['auth-tests-webkit'],
},
```

### 🧠 Wichtig: `dependencies`

Das Feld `dependencies` sorgt dafür, dass `auth.setup.ts` erst nach
erfolgreichen Auth-Tests ausgeführt wird.

------------------------------------------------------------------------

# 3️⃣ Der eigentliche Auth-Setup (`auth.setup.ts`)

``` ts
import { test as setup, expect } from '@playwright/test';
import { getTestData } from '../utils/getTestData';

const authFile = (browserName: string) => 
  `playwright/.auth/${browserName}.json`;

setup('authenticate', async ({ page, baseURL, browserName }) => {
  const { username, email, phone, key } = getTestData(browserName, "");

  await page.goto('/');
  await expect(page).toHaveURL(`${baseURL}/`);

  const signUpButton = page.getByTestId("sign-up-button");
  await signUpButton.click();

  await page.waitForSelector('[role="dialog"]');

  await page.getByTestId("name").fill("Test User");
  await page.getByTestId("username").fill(username);
  await page.getByTestId("email").fill(email);
  await page.getByTestId("phone").fill(phone);
  await page.getByTestId("key").fill(key);
  await page.getByTestId("keyConfirm").fill(key);

  const createAccountButton = page.getByTestId("create-account-button");
  await expect(createAccountButton).not.toBeDisabled({ timeout: 7000 });
  await createAccountButton.click();

  await page.waitForURL(`${baseURL}/home`, { timeout: 15000 });
  await expect(page).toHaveURL(`${baseURL}/home`);

  const successToast = page.locator('.toast-success');
  await expect(successToast).toBeVisible({ timeout: 5000 });

  await page.context().storageState({ path: authFile(browserName) });
});
```

------------------------------------------------------------------------

# 4️⃣ Feature Tests

``` ts
{
  name: 'chromium-features',
  testIgnore: [/auth\.spec\.ts/, /auth\.setup\.ts/],
  use: {
    ...devices['Desktop Chrome'],
    storageState: 'playwright/.auth/chromium.json',
  },
  dependencies: ['auth-initial-chromium'],
},
{
  name: 'webkit-features',
  testIgnore: [/auth\.spec\.ts/, /auth\.setup\.ts/],
  use: {
    ...devices['Desktop Safari'],
    storageState: 'playwright/.auth/webkit.json',
  },
  dependencies: ['auth-initial-webkit'],
},
```

------------------------------------------------------------------------

# 🔄 Gesamtablauf

1.  auth.spec.ts\
2.  auth.setup.ts\
3.  Feature Tests

------------------------------------------------------------------------

# ✅ Ergebnis

-   Kein erneutes Registrieren in jedem Test\
-   Schnellere Testläufe\
-   Saubere Trennung von Auth und Feature-Tests\
-   Deterministische Testumgebung\
-   Keine Datenkollisionen

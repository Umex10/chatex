# Chatex -- E2E Authentication Setup

## 🎯 Goal

To reliably test the **sign-up and sign-in flow**, we first need
dedicated authentication tests.

These verify:

-   ✅ Successful registration\
-   ❌ Failed registration\
-   ✅ Successful sign-in\
-   ❌ Failed sign-in

For this we create a file:

    auth.spec.ts

------------------------------------------------------------------------

# 1️⃣ Auth Flow Tests (`auth.spec.ts`)

Example: **Successful Sign-up**

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

How do **all further tests** get access to an already logged-in user?

We want to avoid:

-   Every test registering a user again\
-   Tests taking unnecessarily long\
-   Data collisions occurring

For this we need a **dedicated auth setup** that runs once and is then
used by all tests.

------------------------------------------------------------------------

# 2️⃣ Playwright Configuration (`playwright.config.ts`)

We define three test areas:

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

### 🧠 Important: `dependencies`

The `dependencies` field ensures that `auth.setup.ts` is only executed
after the auth tests have passed successfully.

------------------------------------------------------------------------

# 3️⃣ The Actual Auth Setup (`auth.setup.ts`)

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

# 🔄 Overall Flow

1.  auth.spec.ts\
2.  auth.setup.ts\
3.  Feature Tests

------------------------------------------------------------------------

# ✅ Result

import page from "@/app/(appshell)/(account)/[username]/(follow)/verifiedFollowers/page";
import { test, expect } from "@playwright/test";
/**
 * Helper to generate unique user data based on the browser
 * We use a function or a shared object to keep it consistent
 */
const getTestData = (browserName: string) => {
  const uniqueId = `${browserName}`; // Unique ID per browser run
  console.log(browserName)
  const uniqueLength = browserName.toLowerCase() === "webkit" ? 4 : 5;
  return {
    username: `${uniqueId}`,
    email: `${uniqueId}@example.com`,
    phone: `+4912345${uniqueLength}6789${uniqueLength}`,
    key: "testKey123"
  };
};

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test('Successful Sign-up', async ({ page, baseURL, browserName }) => {
  const { username, email, phone, key } = getTestData(browserName);

  await expect(page).toHaveURL(`${baseURL}/`);
  const signUpButton = page.getByTestId("sign-up-button");
  await signUpButton.click();

  await page.waitForSelector('[role="dialog"]');

  // Fill using shared credentials
  await page.getByTestId("name").fill("Test User");
  await page.getByTestId("username").fill(username);
  await page.getByTestId("email").fill(email);
  await page.getByTestId("phone").fill(phone);
  await page.getByTestId("key").fill(key);
  await page.getByTestId("keyConfirm").fill(key);

  const createAccountButton = page.getByTestId("create-account-button");
  await expect(createAccountButton).not.toBeDisabled({ timeout: 7000 });
  await createAccountButton.click();

  const loadingToast = page.locator('.toast-loading');
  await expect(loadingToast).toBeVisible();

  await page.waitForURL(`${baseURL}/home`, { timeout: 15000 });
  await expect(page).toHaveURL(`${baseURL}/home`);

  const successToast = page.locator('.toast-success');
  await expect(successToast).toBeVisible();
});

test('Successful Sign-in', async ({ page, baseURL, browserName }) => {
  const { username, key } = getTestData(browserName);

  await expect(page).toHaveURL(`${baseURL}/`);
  const signInButton = page.getByTestId("sign-in-button");
  await signInButton.click();

  await page.waitForSelector('[role="dialog"]');

  // Sign-in with the same username and key
  await page.getByTestId("username").fill(username);
  await page.getByTestId("key").fill(key);

  const confirmSignInButton = page.getByTestId("confirm-sign-in-button");
  await expect(confirmSignInButton).not.toBeDisabled();
  await confirmSignInButton.click();

  const loadingToast = page.locator('.toast-loading');
  await expect(loadingToast).toBeVisible();

  await page.waitForURL(`${baseURL}/home`);
  await expect(page).toHaveURL(`${baseURL}/home`);

  const successToast = page.locator('.toast-success');
  await expect(successToast).toBeVisible();
});

test('Unsuccessful sign-up', async ({ page, baseURL, browserName }) => {
  const { username, email, phone, key } = getTestData(browserName);

  await expect(page).toHaveURL(`${baseURL}/`);
  const signUpButton = page.getByTestId("sign-up-button");
  await signUpButton.click();

  await page.waitForSelector('[role="dialog"]', { timeout: 10000 });

  // Fill using shared "already taken" credentials
  await page.getByTestId("name").fill("Test User");
  await page.getByTestId("username").fill(username);
  await page.getByTestId("email").fill(email);
  await page.getByTestId("phone").fill(phone);
  await page.getByTestId("key").fill(key);
  await page.getByTestId("keyConfirm").fill(key);

  const createAccountButton = page.getByTestId("create-account-button");
  await expect(createAccountButton).not.toBeDisabled({ timeout: 10000 });
  await createAccountButton.click();

  const errorToast = page.locator('.toast-error');
  await expect(errorToast).toBeVisible();

  await expect(page.getByTestId("username-error")).toBeVisible();
  await expect(page.getByTestId("email-error")).toBeVisible();
  await expect(page.getByTestId("phone-error")).toBeVisible();

  await page.getByTestId("username").fill(username + "Unique");
  await page.getByTestId("email").fill(email + "Unique");
  await page.getByTestId("phone").fill(phone + "22");

  // Wait for error to disappear (robust for Firefox)
  await expect(page.getByTestId("username-error")).not.toBeVisible({ timeout: 5000 });
  await expect(page.getByTestId("email-error")).not.toBeVisible({ timeout: 5000 });
  await expect(page.getByTestId("phone-error")).not.toBeVisible({ timeout: 5000 });
})

test('Unsuccessful sign-in', async ({ page, baseURL, browserName }) => {
  const { username, key } = getTestData(browserName);

  await expect(page).toHaveURL(`${baseURL}/`);
  const signInButton = page.getByTestId("sign-in-button");
  await signInButton.click();

  // Sign-in with false credentials
  await page.getByTestId("username").fill(username + "false");
  await page.getByTestId("key").fill(key);

  const confirmSignInButton = page.getByTestId("confirm-sign-in-button");
  await expect(confirmSignInButton).not.toBeDisabled({ timeout: 10000 });
  await confirmSignInButton.click();

  const errorToast = page.locator('.toast-error');
  await expect(errorToast).toBeVisible();

  // Now correct username
  await page.getByTestId("username").fill(username);
})
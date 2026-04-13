import page from "@/app/(appshell)/(account)/[username]/(follow)/verifiedFollowers/page";
import { test, expect } from "@playwright/test";
import { getTestData } from "./utils/getTestData";

test.describe.configure({ mode: 'serial' });

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test('Successful Sign-up', async ({ page, baseURL, browserName }) => {
  const { username, email, phone, key } = getTestData(browserName, "unique");

  await expect(page).toHaveURL(`${baseURL}/`);
  const signUpButton = page.getByTestId("sign-up-account");
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

  await page.waitForURL(`${baseURL}/home`, { timeout: 15000 });
  await expect(page).toHaveURL(`${baseURL}/home`);

  const successToast = page.locator('.toast-success');
  await expect(successToast).toBeVisible({ timeout: 5000 });
});

test('Successful Sign-in', async ({ page, baseURL, browserName }) => {
  const { username, key } = getTestData(browserName, "unique");

  await expect(page).toHaveURL(`${baseURL}/`);
  const signInButton = page.getByTestId("sign-in-account");
  await signInButton.click();

  await page.waitForSelector('[role="dialog"]');

  // Sign-in with the same username and key
  await page.getByTestId("username").fill(username);
  await page.getByTestId("key").fill(key);

  const confirmSignInButton = page.getByTestId("confirm-sign-in-button");
  await expect(confirmSignInButton).not.toBeDisabled();
  await confirmSignInButton.click();

  await page.waitForURL(`${baseURL}/home`);
  await expect(page).toHaveURL(`${baseURL}/home`);

  const successToast = page.locator('.toast-success');
  await expect(successToast).toBeVisible({ timeout: 5000 });
});

test('Unsuccessful sign-up', async ({ page, baseURL, browserName }) => {
  const { username, email, phone, key } = getTestData(browserName, "unique");

  await expect(page).toHaveURL(`${baseURL}/`);
  const signUpButton = page.getByTestId("sign-up-account");
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
  await expect(errorToast).toBeVisible({ timeout: 5000 });

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
  const { username, key } = getTestData(browserName, "unique");

  await expect(page).toHaveURL(`${baseURL}/`);
  const signInButton = page.getByTestId("sign-in-account");
  await signInButton.click();

  // Sign-in with false credentials
  await page.getByTestId("username").fill(username + "false");
  await page.getByTestId("key").fill(key);

  const confirmSignInButton = page.getByTestId("confirm-sign-in-button");
  await expect(confirmSignInButton).not.toBeDisabled({ timeout: 10000 });
  await confirmSignInButton.click();

  const errorToast = page.locator('.toast-error');
  await expect(errorToast).toBeVisible({ timeout: 5000 });

  // Now correct username
  await page.getByTestId("username").fill(username);
})
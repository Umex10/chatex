/**
 * @file End-to-end tests for authentication flows using Playwright.
 * Covers user sign-up scenarios including form interaction and redirect verification.
 */

import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test('Sign-up', async ({ page, baseURL }) => {

  await expect(page).toHaveURL(`${baseURL}/`);

  const signUpButton = page.getByTestId("sign-up-button");
  await expect(signUpButton).toBeVisible();
  await signUpButton.click();

  await page.waitForSelector('[role="dialog"]');

  await page.getByTestId("name").fill("Test User");
  await page.getByTestId("username").fill("testuser123");
  await page.getByTestId("email").fill("test@example.com");
  await page.getByTestId("phone").fill("+1234567890");
  await page.getByTestId("key").fill("testKey123");
  await page.getByTestId("keyConfirm").fill("testKey123");

  const createAccountButton = page.getByTestId("create-account-button");
  await expect(createAccountButton).not.toBeDisabled({ timeout: 5000 });
  await createAccountButton.click();

  await page.waitForURL(`${baseURL}/feed`, { timeout: 10000 });
  await expect(page).toHaveURL(`${baseURL}/feed`);

  const cookies = await page.context().cookies();

  const sessionCookies = cookies.find(c => c.name === "refresh_jwt");

  expect(sessionCookies).toBeDefined();
  expect(sessionCookies?.value).not.toBeNull();

  await page.goto("/");

  await expect(page).toHaveURL(`${baseURL}/feed`);

})

test('Sign-in', async ({ page, baseURL }) => {

  await expect(page).toHaveURL(`${baseURL}/`);

  const signInButton = page.getByTestId("sign-in-button");
  await expect(signInButton).toBeVisible();
  await signInButton.click();

  await page.waitForSelector('[role="dialog"]');

  await page.getByTestId("username").fill("testuser123");
  await page.getByTestId("key").fill("testKey123");

  const confirmSignInButton = page.getByTestId("confirm-sign-in-button");
  await expect(confirmSignInButton).not.toBeDisabled({ timeout: 5000 });
  await confirmSignInButton.click();

  await page.waitForURL(`${baseURL}/feed`, { timeout: 10000 });
  await expect(page).toHaveURL(`${baseURL}/feed`);

  const cookies = await page.context().cookies();

  const sessionCookies = cookies.find(c => c.name === "refresh_jwt");

  expect(sessionCookies).toBeDefined();
  expect(sessionCookies?.value).not.toBeNull();

  await page.goto("/");

  await expect(page).toHaveURL(`${baseURL}/feed`);

})
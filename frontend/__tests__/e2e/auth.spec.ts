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

  const signUpButton = page.getByRole('button', { name: 'Get Started' });
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

})
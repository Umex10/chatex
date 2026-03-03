/**
 * Pre-authenticates Playwright browsers by provisioning a dedicated account and
 * persisting its storage state to disk. Other specs pass their own
 * {@code uniqueIdentifier} to {@link getTestData} so they do not collide with
 * this bootstrap user.
 */
import { test as setup, expect } from '@playwright/test';
import { getTestData } from '../utils/getTestData';

const authFile = (browserName: string) => `playwright/.auth/${browserName}.json`;

setup('authenticate', async ({ page, baseURL, browserName }) => {
  const { username, email, phone, key } = getTestData(browserName, "");

  await page.goto('/');

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

  await page.waitForURL(`${baseURL}/home`, { timeout: 15000 });
  await expect(page).toHaveURL(`${baseURL}/home`);

  const successToast = page.locator('.toast-success');
  await expect(successToast).toBeVisible({ timeout: 5000 });

  await page.context().storageState({ path: authFile(browserName) });
});
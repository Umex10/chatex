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

  const mainUser = getTestData(browserName, "main");
  const userToFollow = getTestData(browserName, "target1");

  const usersToCreate = [userToFollow, mainUser]; // Set mainuser at the end

  for (const user of usersToCreate) {
    await page.goto('/');

    await page.getByTestId("sign-up-button").click();
    await page.waitForSelector('[role="dialog"]');

    await page.getByTestId("name").fill(user.username);
    await page.getByTestId("username").fill(user.username);
    await page.getByTestId("email").fill(user.email);
    await page.getByTestId("phone").fill(user.phone);
    await page.getByTestId("key").fill(user.key);
    await page.getByTestId("keyConfirm").fill(user.key);

    await page.getByTestId("create-account-button").click();

    await page.waitForURL(`${baseURL}/home`);
    await expect(page.locator('.toast-success')).toBeVisible();

    // If it is not the main user, then clear the storae as well as cookies, so we only have
    // one refresh tk at the end for the tests
    if (user !== mainUser) {

      await page.context().clearCookies();
      await page.evaluate(() => localStorage.clear());
    }

    // Now save them into the localstorae so we have still access to them
    await page.evaluate(({user}) => {
      localStorage.setItem('test_user', user);
    }, { user: userToFollow.username });
  }

  // Only save the authFile if it is the mainUser 
  await page.context().storageState({ path: authFile(browserName) });
});
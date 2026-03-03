import { test, expect } from "@playwright/test";

test.describe.configure({ mode: 'serial' });

test('Successful edit on the account', async ({ page, baseURL, browserName }) => {

  await page.goto(`${baseURL}/home`);
  await expect(page).toHaveURL(`${baseURL}/home`);


});

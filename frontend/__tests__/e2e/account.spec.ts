import { test, expect } from "@playwright/test";

test.describe.configure({ mode: 'serial' }); // Since the tests need to be in order

test('Successful follow on a user', async ({ page, baseURL, browserName }) => {

  await page.goto(`${baseURL}/home`);
  await expect(page).toHaveURL(`${baseURL}/home`);

  const targetUsername = await page.evaluate(() => localStorage.getItem('test_user_1'));
  await page.goto(`${baseURL}/${targetUsername}`)

  const followBtn = page.getByTestId("follow-btn");
  await followBtn.click();

  const accountIcon = page.getByTestId("account-icon");
  await accountIcon.click();

  const followingList = page.getByTestId("following-list");
  await followingList.click();

  const followingLabel = page.getByTestId("following-label");
  await expect(followingLabel).toHaveClass(/underline/); // This means it is the active tab

  const username = page.getByText(targetUsername ?? "").first();
  await expect(username).toBeVisible();
});

test('Successful unfollow on a user', async ({ page, baseURL, browserName }) => {

  await page.goto(`${baseURL}/home`);
  await expect(page).toHaveURL(`${baseURL}/home`);

  const targetUsername = await page.evaluate(() => localStorage.getItem('test_user_1'));
  await page.goto(`${baseURL}/${targetUsername}`)

  const unfollowBtn = page.getByTestId("follow-btn"); // to unfollow 
  await unfollowBtn.click();

  const accountIcon = page.getByTestId("account-icon");
  await accountIcon.click();

  const followingList = page.getByTestId("following-list");
  await followingList.click();

  const followingLabel = page.getByTestId("following-label");
  await expect(followingLabel).toHaveClass(/underline/); // This means it is the active tab

  const username = page.getByText(targetUsername ?? "").first();
  await expect(username).not.toBeVisible();
});

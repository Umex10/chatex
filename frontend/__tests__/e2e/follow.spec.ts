import { test, expect } from "@playwright/test";

test.describe.configure({ mode: 'serial' }); // Since the tests need to be in order


test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/home`);
  await expect(page).toHaveURL(`${baseURL}/home`);
})

test('Successful follow on a user on the account', async ({ page, baseURL }) => {

  // Visit the user's account
  const targetUsername = await page.evaluate(() => localStorage.getItem('test_user'));
  await page.goto(`${baseURL}/${targetUsername}`)

  await page.waitForLoadState('networkidle');

  // Follow him
  const followBtn = page.getByTestId("follow-btn");
  await followBtn.click();

  // After click
  await expect(followBtn).toHaveText(/following/i);

  // Follower count after the click
  const followersCount = page.getByTestId("followers-count");
  await expect(followersCount).toHaveText("1", { timeout: 5000 });

  // Visit his followers list
  const followersList = page.getByTestId("followers-list");
  await followersList.click();

  // Access the signed-in username in the sidebar
  const usernameInSidebar = await page.getByTestId("username-in-sidebar").innerText();

  // Search for that username inside the follow layout, so we don't end up searching
  // for the username in the sidebar again
  const followSite = page.getByTestId("follow-site");
  const usernameInList = followSite.getByTestId("username-in-list");
  await expect(usernameInList).toBeVisible({ timeout: 5000 });
  await expect(usernameInList).toHaveText(new RegExp(usernameInSidebar, 'i'));

  // Click the account icon in the sidebar to access the account of the signed in user
  const accountIcon = page.getByTestId("account-icon");
  await accountIcon.click();

  // Following count after the click
  const followingCount = page.getByTestId("following-count");
  await expect(followingCount).toHaveText("1", { timeout: 5000 });

  // Visit his following list
  const followingList = page.getByTestId("following-list");
  await followingList.click();

  await page.waitForLoadState('networkidle');

  // This means it is the active tab of the shadcn Tabs
  const followingLabel = page.getByTestId("following-label");
  await expect(followingLabel).toHaveClass(/underline/);

  // username should be listed in the list
  const username = page.getByText(targetUsername ?? "").first();
  await expect(username).toBeVisible();
});

test('Successful unfollow on a user on the account', async ({ page, baseURL }) => {

  // Visit the user's account
  const targetUsername = await page.evaluate(() => localStorage.getItem('test_user'));
  await page.goto(`${baseURL}/${targetUsername}`)

  await page.waitForLoadState('networkidle');

  // Unfollow him
  const unfollowBtn = page.getByTestId("follow-btn");
  await unfollowBtn.click();

  // After click
  await expect(unfollowBtn).toHaveText(/follow/i);

  // Follower count after the click
  const followersCount = page.getByTestId("followers-count");
  await expect(followersCount).toHaveText("0", { timeout: 5000 });

  // Visit his followers list
  const followersList = page.getByTestId("followers-list");
  await followersList.click();

  // Access the signed in username in the sidebar
  const followSite = page.getByTestId("follow-site");
  const usernameInList = followSite.getByTestId("username-in-list");
  await expect(usernameInList).not.toBeVisible({ timeout: 5000 });

  // Click the account icon in the sidebar to access the account of the signed in user
  const accountIcon = page.getByTestId("account-icon");
  await accountIcon.click();

  await page.waitForLoadState('networkidle');

  // Following count after the click
  const followingCount = page.getByTestId("following-count");
  await expect(followingCount).toHaveText("0", { timeout: 5000 });

  // Visit his following list
  const followingList = page.getByTestId("following-list");
  await followingList.click();

  // This means it is the active tab of the shadcn Tabs
  const followingLabel = page.getByTestId("following-label");
  await expect(followingLabel).toHaveClass(/underline/);

  // username should be removed from the list
  const username = page.getByText(targetUsername ?? "").first();
  await expect(username).not.toBeVisible();
});

test("Successful unfollow on a user on the follower list", async ({ page, baseURL }) => {

  // Visit the user's account
  const targetUsername = await page.evaluate(() => localStorage.getItem('test_user'));
  await page.goto(`${baseURL}/${targetUsername}`)

  await page.waitForLoadState('networkidle');

  // Follow him
  const followBtn = page.getByTestId("follow-btn");
  await followBtn.click();

  // After click
  await expect(followBtn).toHaveText(/following/i);

  // Follower count after the click
  const followersCount = page.getByTestId("followers-count");
  await expect(followersCount).toHaveText("1", { timeout: 5000 });

  // Click the account icon in the sidebar to access the account of the signed in user
  const accountIcon = page.getByTestId("account-icon");
  await accountIcon.click();

  await page.waitForLoadState('networkidle');

  // Following count after the click
  const followingCount = page.getByTestId("following-count");
  await expect(followingCount).toHaveText("1", { timeout: 5000 });

  // Visit his following list
  const followingList = page.getByTestId("following-list");
  await followingList.click();

  // Search for that username inside the follow layout, so we don't end up searching
  // for the username in the sidebar again
  const followBtnInList = page.getByTestId("follow-btn-in-list");
  await expect(followBtnInList).toHaveText(/following/i);
  await followBtnInList.click();
  await expect(followBtnInList).toHaveText(/follow/i);

  // Return to the followers overview
  // Wait for the unfollow state to settle before clicking the sticky header button.
  // scrollIntoView must NOT be used here - it causes a scroll that moves the sticky
  // element and makes WebKit flag it as unstable.
  const returnBtn = page.getByTestId("return-btn");
  await expect(returnBtn).toBeVisible({ timeout: 5000 });
  await returnBtn.click({ force: true });

  // Follower count after the click
  await expect(followersCount).toHaveText("0");

  // Visit the user's account again
  await page.goto(`${baseURL}/${targetUsername}`)

  // Follower count after the click
  await expect(followersCount).toHaveText("0", { timeout: 5000 });
})

import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page, baseURL }) => {
  await page.goto(`${baseURL}/account`);
  await expect(page).toHaveURL(`${baseURL}/account`);
})


test('Successful edit of the account', async ({ page, baseURL }) => {

  // Click the account icon in the sidebar to access the account of the signed in user
  const accountIcon = page.getByTestId("account-icon");
  await accountIcon.click();

  const usernameInSidebar = await page.getByTestId("username-in-sidebar").innerText();
  const usernameInSidebarCut = usernameInSidebar.slice(1,);

  const editAccountBtn = page.getByTestId("edit-account-btn");
  await editAccountBtn.click();

  const nameField = page.getByTestId("name-field");
  const bioField = page.getByTestId("bio-field");
  const locationField = page.getByTestId("location-field");
  const websiteField = page.getByTestId("website-field");
  const avatarImg = page.getByTestId("avatar-img");
  const bannerImg = page.getByTestId("banner-img");
  const avatarValue = page.getByTestId("avatar-value");
  const bannerValue = page.getByTestId("banner-value");

  await expect(nameField).toHaveValue(new RegExp(usernameInSidebarCut, 'i'), { timeout: 5000 });
  await expect(bioField).toHaveValue("");
  await expect(locationField).toHaveValue("");
  await expect(websiteField).toHaveValue("");
  await expect(avatarImg).toHaveAttribute('src', /user-avatar_yr4qhg/);
  await expect(bannerImg).toHaveAttribute('src', /stadion_x556pn/);

  await nameField.fill("new name");
  await bioField.fill("new bio");
  await locationField.fill("new location");
  await websiteField.fill("http://localhost.com");
  await avatarValue.setInputFiles("public/acc.png");
  await bannerValue.setInputFiles("public/acc.png");

  const saveChangesButton = page.getByTestId("save-changes-btn");
  await saveChangesButton.click();

  await expect(page.locator('.toast-success')).toBeVisible({ timeout: 20000 });

  await expect(nameField).toHaveValue("new name");
  await expect(bioField).toHaveValue("new bio");
  await expect(locationField).toHaveValue("new location");
  await expect(websiteField).toHaveValue("http://localhost.com");
  await expect(avatarImg).not.toHaveAttribute('src', /user-avatar_yr4qhg/);
  await expect(bannerImg).not.toHaveAttribute('src', /stadion_x556pn/);
})
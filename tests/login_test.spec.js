import { test, expect } from "@playwright/test";

test.describe("login validation", () => {
  const siteUrl = "https://travelbug-social.netlify.app/";

  const validUsername = "testbot";
  const invalidUsername = " ";

  const validPassword = "test123";
  const invalidPassword = "123";

  test.beforeEach(async ({ page }) => {
    await page.goto(siteUrl);
    await page.waitForTimeout(2000);
    await page.$eval("a[href='/login']", (elem) => elem.click());
    await page.waitForTimeout(2000);
  });

  test("username test", async ({ page }) => {
    await page.type("input[name='username']", invalidUsername);
    await page.click("button[type='submit']");
    await page.waitForTimeout(2000);
    const invalidUsernameField = await page.waitForSelector(
      "div[class='invalid-feedback']"
    );
    const invalidUserText = await invalidUsernameField.evaluate(
      (el) => el.textContent
    );
    expect(invalidUserText).toBe("User doesn't exist");
  });

  test("password test", async ({ page }) => {
    await page.type("input[name='username']", validUsername);
    await page.waitForTimeout(2000);
    await page.type("input[name='password']", invalidPassword);
    await page.click("button[type='submit']");
    await page.waitForTimeout(2000);
    const invalidPasswordField = await page.waitForSelector(
      "div[class='invalid-feedback']"
    );
    const invalidPasswordText = await invalidPasswordField.evaluate(
      (el) => el.textContent
    );
    expect(invalidPasswordText).toBe("Invalid credentials");
  });

  test("form submission test", async ({ page }) => {
    await page.type("input[name='username']", validUsername);
    await page.waitForTimeout(2000);
    await page.type("input[name='password']", validPassword);
    await page.waitForTimeout(2000);
    await page.click("button[type='submit']");
    await page.waitForTimeout(2000);
    const element = await page.waitForSelector(
      "a[class='dropdown-toggle nav-link']"
    );
    const usernameValue = await element.evaluate((el) => el.textContent);
    expect(usernameValue).toBe(validUsername);
  });
});

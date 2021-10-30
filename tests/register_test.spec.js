import { test, expect } from "@playwright/test";

test.describe("register validation", () => {
  const siteUrl = "https://travelbug-social.netlify.app/";

  const validUsername = "Larry";
  const invalidUsername = "Moe";
  const usernameThatExists = "Kimberly";

  const validEmail = "bob@email.com";
  const invalidEmail = "123";

  const validPassword = "123456";
  const invalidPassword = "123";

  const validConfirmPassword = validPassword;
  const invalidConfirmPassword = "123";

  test.beforeEach(async ({ page }) => {
    await page.goto(siteUrl);
    await page.waitForTimeout(2000);
    await page.$eval("a[href='/signup']", (elem) => elem.click());
    await page.waitForTimeout(2000);
  });

  test("username test", async ({ page }) => {
    // error message: "Username length must be greater than 3"
    const usernameInput = await page.$("input[name='username']");
    await usernameInput.type(invalidUsername);
    await page.click("button[type='submit']");
    await page.waitForTimeout(2000);
    const invalidUsernameLengthField = await page.waitForSelector(
      "div[class='invalid-feedback']"
    );
    const invalidUsernameLengthText = await invalidUsernameLengthField.evaluate(
      (el) => el.textContent
    );
    expect(invalidUsernameLengthText).toBe(
      "Username length must be greater than 3"
    );
    await page.waitForTimeout(2000);
    // error message: "Username taken"
    await usernameInput.click({ clickCount: 3 });
    await usernameInput.type(usernameThatExists);
    await page.waitForTimeout(2000);
    await page.click("button[type='submit']");
    await page.waitForTimeout(2000);
    const invalidUsernameTextField = await page.waitForSelector(
      "div[class='invalid-feedback']"
    );
    const invalidUsernameTakenText = await invalidUsernameTextField.evaluate(
      (el) => el.textContent
    );
    expect(invalidUsernameTakenText).toBe("Username taken");
  });

  test("email test", async ({ page }) => {
    await page.type("input[name='username']", validUsername);
    await page.type("input[name='email']", invalidEmail);
    await page.waitForTimeout(2000);
    await page.click("button[type='submit']");
    await page.waitForTimeout(2000);
    const invalidEmailField = await page.waitForSelector(
      "div[class='invalid-feedback']"
    );
    const invalidEmailText = await invalidEmailField.evaluate(
      (el) => el.textContent
    );
    expect(invalidEmailText).toBe("Invalid email address");
  });

  test("password test", async ({ page }) => {
    await page.type("input[name='username']", validUsername);
    await page.type("input[name='email']", validEmail);
    await page.type("input[name='password']", invalidPassword);
    await page.click("button[type='submit']");
    await page.waitForTimeout(2000);
    const invalidPasswordField = await page.waitForSelector(
      "div[class='invalid-feedback']"
    );
    const invalidPasswordText = await invalidPasswordField.evaluate(
      (el) => el.textContent
    );
    expect(invalidPasswordText).toBe("Password length must be greater than 5");
  });

  test("confirm password test", async ({ page }) => {
    await page.type("input[name='username']", validUsername);
    await page.type("input[name='email']", validEmail);
    await page.type("input[name='password']", validPassword);
    await page.type("input[name='confirmPassword']", invalidConfirmPassword);
    await page.click("button[type='submit']");
    await page.waitForTimeout(2000);
    const invalidConfirmPasswordField = await page.waitForSelector(
      "div[class='invalid-feedback']"
    );
    const invalidConfirmPasswordText =
      await invalidConfirmPasswordField.evaluate((el) => el.textContent);
    expect(invalidConfirmPasswordText).toBe("Passwords do not match");
  });

  test("form submission test", async ({ page }) => {
    await page.type("input[name='username']", validUsername);
    await page.waitForTimeout(2000);
    await page.type("input[name='email']", validEmail);
    await page.waitForTimeout(2000);
    await page.type("input[name='password']", validPassword);
    await page.waitForTimeout(2000);
    await page.type("input[name='confirmPassword']", validConfirmPassword);
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

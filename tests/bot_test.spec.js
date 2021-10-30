import { test } from "@playwright/test";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const siteUrl = "https://travelbug-social.netlify.app/";

const validUsername = "Larry";
const validEmail = "bob@email.com";
const validPassword = "123456";
const validConfirmPassword = validPassword;

const myImage = path.join(__dirname, "../", "assets", "beach.jpg");
const myLocation = "Rockaway Beach, NY";
const myCaption = "Surfs up!";

test("bot test", async ({ page }) => {
  // route to signup page
  await page.goto(siteUrl);
  await page.waitForTimeout(1500);
  await page.$eval("a[href='/signup']", (elem) => elem.click());
  // register form submission
  await page.type("input[name='username']", validUsername);
  await page.type("input[name='email']", validEmail);
  await page.type("input[name='password']", validPassword);
  await page.type("input[name='confirmPassword']", validConfirmPassword);
  await page.click("button[type='submit']");
  await page.waitForTimeout(1500);
  // route to upload
  await page.$eval("a[href='/create-post']", (elem) => elem.click());
  await page.waitForTimeout(1500);
  // create-post submission
  await page.setInputFiles("input[name='selectedFile']", myImage);
  await page.type("input[name='location']", myLocation);
  await page.type("textarea[name='caption']", myCaption);
  await page.click("button[type='submit']");
  await page.waitForTimeout(1500);
  // route to home page
  await page.$eval("a[href='/']", (elem) => elem.click());
  await page.waitForLoadState("networkidle");
  // screenshot for proof it worked!
  await page.screenshot({ path: "screenshot.png", fullPage: true });
});

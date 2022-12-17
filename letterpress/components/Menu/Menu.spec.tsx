import { ReactNode } from "react";
import { test, expect } from "@playwright/experimental-ct-react";
import Menu from "./Menu";

test.describe("Menu block desktop", () => {
  // Old-school CRT monitor screensize
  test.use({ viewport: { width: 1024, height: 768 } });

  const open = true;
  const slogan = "I am a slogan";
  const menuName = "A menu name";
  const menu: ReactNode[] = [];

  test("Menu should contain text", async ({ mount, page }) => {
    await mount(
      <Menu open={open} slogan={slogan} menuName={menuName} menuItems={menu} />
    );
    const menuSlogan = await page.locator('span:has-text("I am a slogan")');
    await expect(menuSlogan).toContainText("I am a slogan");
  });

  test("Menu should match screenshot", async ({ mount, page }) => {
    await mount(
      <Menu open={open} slogan={slogan} menuName={menuName} menuItems={menu} />
    );
    await expect(page).toHaveScreenshot();
  });
});

test.describe("Main block mobile", () => {
  // IPhone 13 screen size
  test.use({ viewport: { width: 1024, height: 768 } });

  const open = true;
  const slogan = "I am a slogan";
  const menuName = "A menu name";
  const menu: ReactNode[] = [];

  test("Menu should contain text", async ({ mount, page }) => {
    await mount(
      <Menu open={open} slogan={slogan} menuName={menuName} menuItems={menu} />
    );
    const menuSlogan = await page.locator('span:has-text("I am a slogan")');
    await expect(menuSlogan).toContainText("I am a slogan");
  });

  test("Menu should match screenshot", async ({ mount, page }) => {
    await mount(
      <Menu open={open} slogan={slogan} menuName={menuName} menuItems={menu} />
    );
    await expect(page).toHaveScreenshot();
  });
});

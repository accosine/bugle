import { test, expect } from "@playwright/experimental-ct-react";
import Layout from "./Layout";

test.describe("Layout block desktop ", () => {
  const desktopWidth = 1024;
  const desktopHeight = 768;
  test.use({
    viewport: { width: desktopWidth, height: desktopHeight },
  });
  test(`Layout should display and show a modal (desktop viewport)`, async ({
    mount,
    page,
  }) => {
    const component = await mount(
      <Layout
        menu={[]}
        menuName="My Menu"
        nameplate="My Name is..."
        copyright="©"
        slogan="Nice slogan here"
        location="/home"
      >
        <span>I am text in the Layout area</span>
      </Layout>
    );

    await expect(component).toContainText("I am text in the Layout area");

    // Test if clicking the hamburger menu opens a modal
    await expect(component).toHaveScreenshot();
    const hamburgerMenu = component.locator("#letterpress-hamburger");
    await hamburgerMenu.click();
    await expect(hamburgerMenu).toBeTruthy();
    const letterpressAreaBottom = page.locator(
      'span:has-text("Nice slogan here")'
    );
    await expect(letterpressAreaBottom).toContainText("Nice slogan here");
    await expect(component).toHaveScreenshot();
  });
});

test.describe("Layout block mobile ", () => {
  const width = 390;
  const height = 844;
  test.use({
    viewport: { width, height },
  });
  test(`Layout should display and show a modal (mobile viewport)`, async ({
    mount,
    page,
  }) => {
    const component = await mount(
      <Layout
        menu={[]}
        menuName="My Menu"
        nameplate="My Name is..."
        copyright="©"
        slogan="Nice slogan here"
        location="/home"
      >
        <span>I am text in the Layout area</span>
      </Layout>
    );
    await expect(component).toContainText("I am text in the Layout area");

    // Test if clicking the hamburger menu opens a modal
    await expect(component).toHaveScreenshot();
    const hamburgerMenu = component.locator("#letterpress-hamburger");
    await hamburgerMenu.click();
    await expect(hamburgerMenu).toBeTruthy();
    const letterpressAreaBottom = page.locator(
      'span:has-text("Nice slogan here")'
    );
    await expect(letterpressAreaBottom).toContainText("Nice slogan here");
    await expect(component).toHaveScreenshot();
  });
});

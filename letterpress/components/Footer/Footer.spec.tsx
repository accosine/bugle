import { test, expect } from "@playwright/experimental-ct-react";
import Footer from "./Footer";

test.describe("Footer block desktop", () => {
  // Old-school CRT monitor screensize
  test.use({ viewport: { width: 1024, height: 768 } });

  test("Footer should contain text", async ({ mount }) => {
    const component = await mount(
      <Footer>
        <span>I am text in the footer area</span>
      </Footer>
    );
    await expect(component).toContainText("I am text in the footer area");
  });

  test("Footer should match screenshot", async ({ mount }) => {
    const component = await mount(
      <Footer>
        <span>I am text in the footer area</span>
      </Footer>
    );
    await expect(component).toHaveScreenshot();
  });
});

test.describe("Footer block mobile", () => {
  // IPhone 13 screen size
  test.use({ viewport: { width: 390, height: 884 } });

  test("Footer should contain text", async ({ mount }) => {
    const component = await mount(
      <Footer>
        <span>I am text in the footer area</span>
      </Footer>
    );
    await expect(component).toContainText("I am text in the footer area");
  });

  test("Footer should match screenshot", async ({ mount }) => {
    const component = await mount(
      <Footer>
        <span>I am some other text in the footer area</span>
      </Footer>
    );
    await expect(component).toHaveScreenshot();
  });
});

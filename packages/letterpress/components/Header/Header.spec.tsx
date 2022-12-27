import { test, expect } from "@playwright/experimental-ct-react";
import Header from "./Header";

test.describe("Header block desktop", () => {
  // Old-school CRT monitor screensize
  test.use({ viewport: { width: 1024, height: 768 } });

  test("Header should contain text", async ({ mount }) => {
    const component = await mount(
      <Header>
        <span>I am text in the header area</span>
      </Header>
    );
    await expect(component).toContainText("I am text in the header area");
  });

  test("Header should match screenshot", async ({ mount }) => {
    const component = await mount(
      <Header>
        <span>I am text in the header area</span>
      </Header>
    );
    await expect(component).toHaveScreenshot();
  });
});

test.describe("Header block mobile", () => {
  // IPhone 13 screen size
  test.use({ viewport: { width: 390, height: 884 } });

  test("Header should contain text", async ({ mount }) => {
    const component = await mount(
      <Header>
        <span>I am text in the header area</span>
      </Header>
    );
    await expect(component).toContainText("I am text in the header area");
  });

  test("Header should match screenshot", async ({ mount }) => {
    const component = await mount(
      <Header>
        <span>I am some other text in the header area</span>
      </Header>
    );
    await expect(component).toHaveScreenshot();
  });
});

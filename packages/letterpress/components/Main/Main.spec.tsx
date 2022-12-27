import { test, expect } from "@playwright/experimental-ct-react";
import Main from "./Main";

test.describe("Main block desktop", () => {
  // Old-school CRT monitor screensize
  test.use({ viewport: { width: 1024, height: 768 } });

  test("Main should contain text", async ({ mount }) => {
    const component = await mount(
      <Main>
        <span>I am text in the main area</span>
      </Main>
    );
    await expect(component).toContainText("I am text in the main area");
  });

  test("Main should match screenshot", async ({ mount }) => {
    const component = await mount(
      <Main>
        <span>I am text in the main area</span>
      </Main>
    );
    await expect(component).toHaveScreenshot();
  });
});

test.describe("Main block mobile", () => {
  // IPhone 13 screen size
  test.use({ viewport: { width: 390, height: 884 } });

  test("Main should contain text", async ({ mount }) => {
    const component = await mount(
      <Main>
        <span>I am text in the main area</span>
      </Main>
    );
    await expect(component).toContainText("I am text in the main area");
  });

  test("Main should match screenshot", async ({ mount }) => {
    const component = await mount(
      <Main>
        <span>I am some other text in the Main area</span>
      </Main>
    );
    await expect(component).toHaveScreenshot();
  });
});

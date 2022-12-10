import { test, expect } from "@playwright/experimental-ct-react";
import Hamburger from "./Hamburger";

test.describe("Hamburger block", () => {
  test(`Hamburger should display in closed state`, async ({ mount }) => {
    const component = await mount(<Hamburger open={false} />);

    await expect(component).toHaveScreenshot();
  });

  test(`Hamburger should display in open state`, async ({ mount }) => {
    const component = await mount(<Hamburger open={true} />);

    await expect(component).toHaveScreenshot();
  });
});

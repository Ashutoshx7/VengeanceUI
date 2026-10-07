import { expect, test, type Page } from "@playwright/test";

const sidebar = (page: Page) => page.locator("aside").first();
const link = (page: Page, path: string) => sidebar(page).locator(`a[href="${path}"]`);
const pageScroll = (page: Page) => page.evaluate(() => window.scrollY);

async function expectActiveLinkInView(page: Page, path: string) {
  const activeLink = link(page, path);
  await expect(activeLink).toHaveAttribute("aria-current", "page");
  await expect.poll(() => activeLink.evaluate((element) => {
    const linkBounds = element.getBoundingClientRect();
    const sidebarBounds = element.closest("aside")!.getBoundingClientRect();
    const headerBottom = document.querySelector("header")!.getBoundingClientRect().bottom;
    return linkBounds.top >= Math.max(sidebarBounds.top, headerBottom) &&
      linkBounds.bottom <= Math.min(sidebarBounds.bottom, window.innerHeight);
  })).toBe(true);
  await expect(sidebar(page).locator('a[aria-current="page"]')).toHaveCount(1);
}

async function scrollPageTo(page: Page, top: number) {
  await page.evaluate((value) => window.scrollTo(0, value), top);
  await expect.poll(() => pageScroll(page)).toBe(top);
}

async function wheelSidebar(page: Page, delta: number) {
  await sidebar(page).evaluate((element) => {
    element.setAttribute("data-wheel-processed", "false");
    element.addEventListener("wheel", () => {
      // Wait for wheel dispatch and the resulting compositor frames.
      requestAnimationFrame(() => requestAnimationFrame(() => {
        element.setAttribute("data-wheel-processed", "true");
      }));
    }, { once: true, passive: true });
  });
  await page.mouse.wheel(0, delta);
  await expect(sidebar(page)).toHaveAttribute("data-wheel-processed", "true");
}

test("sidebar navigation preserves page scroll across docs and component layouts", async ({ page }) => {
  await page.goto("/docs/install-nextjs");
  await expectActiveLinkInView(page, "/docs/install-nextjs");
  await scrollPageTo(page, 500);

  for (const path of [
    "/components/my-animated-button",
    "/components/radial-glow-button",
    "/components/social-flip-button",
    "/docs/install-tailwind",
  ]) {
    await link(page, path).click();
    await expect(page).toHaveURL(path);
    await expectActiveLinkInView(page, path);
    await expect.poll(() => pageScroll(page)).toBe(500);
  }
});

test("direct component links and reload reveal the active item without moving the page", async ({ page }) => {
  await page.goto("/components/liquid-ocean");
  await expectActiveLinkInView(page, "/components/liquid-ocean");
  expect(await pageScroll(page)).toBe(0);
  expect(await sidebar(page).evaluate((element) => element.scrollTop)).toBeGreaterThan(0);

  await page.reload();
  await expectActiveLinkInView(page, "/components/liquid-ocean");
  expect(await pageScroll(page)).toBe(0);
});

test("navigation leaves an already-visible sidebar item in place", async ({ page }) => {
  await page.goto("/components/my-animated-button");
  await expectActiveLinkInView(page, "/components/my-animated-button");
  await sidebar(page).evaluate((element) => { element.scrollTop = 150; });
  const before = await sidebar(page).evaluate((element) => element.scrollTop);
  expect(before).toBeGreaterThan(0);
  await link(page, "/components/candy-button").click();
  await expect(page).toHaveURL("/components/candy-button");
  await expectActiveLinkInView(page, "/components/candy-button");
  expect(await sidebar(page).evaluate((element) => element.scrollTop)).toBe(before);
});

test("search navigation scrolls the sidebar to a distant active item", async ({ page }) => {
  await page.goto("/components/my-animated-button");
  await expectActiveLinkInView(page, "/components/my-animated-button");
  await page.getByRole("button", { name: "Search documentation..." }).click();
  await page.getByPlaceholder("Search components, templates, docs...").fill("Animated Tooltip");
  await page.getByRole("option", { name: /Animated Tooltip/ }).click();
  await expect(page).toHaveURL("/components/animated-tooltip");
  await expectActiveLinkInView(page, "/components/animated-tooltip");
  expect(await pageScroll(page)).toBe(0);

  await page.getByRole("button", { name: "Search documentation..." }).click();
  await page.getByPlaceholder("Search components, templates, docs...").fill("Animated Button");
  await page.getByRole("option", { name: /Animated Button Animated CTA/ }).click();
  await expect(page).toHaveURL("/components/my-animated-button");
  await expectActiveLinkInView(page, "/components/my-animated-button");
  expect(await pageScroll(page)).toBe(0);
});

test("hash deep links keep their content section in view", async ({ page }) => {
  await page.goto("/components/radial-glow-button#installation");
  await expectActiveLinkInView(page, "/components/radial-glow-button");
  await expect.poll(() => pageScroll(page)).toBeGreaterThan(0);
  await expect(page.locator("#installation")).toBeInViewport();
});

test("keyboard navigation preserves scroll and modified clicks open a new tab", async ({ page, context }) => {
  await page.goto("/components/my-animated-button");
  await expectActiveLinkInView(page, "/components/my-animated-button");
  await scrollPageTo(page, 400);
  const target = link(page, "/components/radial-glow-button");
  await target.focus();
  await target.press("Enter");
  await expect(page).toHaveURL("/components/radial-glow-button");
  await expectActiveLinkInView(page, "/components/radial-glow-button");
  expect(await pageScroll(page)).toBe(400);

  const newTabPromise = context.waitForEvent("page");
  await link(page, "/components/social-flip-button").click({ modifiers: ["ControlOrMeta"] });
  const newTab = await newTabPromise;
  await expect(newTab).toHaveURL("/components/social-flip-button");
  await expect(page).toHaveURL("/components/radial-glow-button");
  expect(await pageScroll(page)).toBe(400);
  await newTab.close();
});

test("back and forward navigation restore page scroll and reveal the active item", async ({ page }) => {
  await page.goto("/components/my-animated-button");
  await expectActiveLinkInView(page, "/components/my-animated-button");
  await scrollPageTo(page, 400);
  await link(page, "/components/radial-glow-button").click();
  await expectActiveLinkInView(page, "/components/radial-glow-button");
  await scrollPageTo(page, 700);

  await page.goBack();
  await expect(page).toHaveURL("/components/my-animated-button");
  await expectActiveLinkInView(page, "/components/my-animated-button");
  await expect.poll(() => pageScroll(page)).toBe(400);
  await page.goForward();
  await expect(page).toHaveURL("/components/radial-glow-button");
  await expectActiveLinkInView(page, "/components/radial-glow-button");
  await expect.poll(() => pageScroll(page)).toBe(700);
});

test("manual sidebar scrolling stays independent and does not snap back", async ({ page }) => {
  await page.goto("/components/my-animated-button");
  await expectActiveLinkInView(page, "/components/my-animated-button");
  await scrollPageTo(page, 400);
  await sidebar(page).evaluate((element) => { element.scrollTop = 500; });
  await sidebar(page).hover();
  await wheelSidebar(page, 600);
  await expect.poll(() => sidebar(page).evaluate((element) => element.scrollTop)).toBeGreaterThan(500);
  expect(await pageScroll(page)).toBe(400);

  const bottom = await sidebar(page).evaluate((element) => element.scrollHeight - element.clientHeight);
  await wheelSidebar(page, 10_000);
  await expect.poll(() => sidebar(page).evaluate((element) => element.scrollTop)).toBe(bottom);
  await wheelSidebar(page, 600);
  expect(await pageScroll(page)).toBe(400);
  expect(await sidebar(page).evaluate((element) => element.scrollTop)).toBe(bottom);

  await wheelSidebar(page, -10_000);
  await expect.poll(() => sidebar(page).evaluate((element) => element.scrollTop)).toBe(0);
  await wheelSidebar(page, -600);
  expect(await pageScroll(page)).toBe(400);
  expect(await sidebar(page).evaluate((element) => element.scrollTop)).toBe(0);
});

test("reduced-motion navigation and responsive resizing reveal active links", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/components/animated-tooltip");
  await expect(sidebar(page)).toBeHidden();
  expect(await pageScroll(page)).toBe(0);

  await page.setViewportSize({ width: 1280, height: 720 });
  await expectActiveLinkInView(page, "/components/animated-tooltip");
  expect(await pageScroll(page)).toBe(0);
  await page.setViewportSize({ width: 1280, height: 400 });
  await expectActiveLinkInView(page, "/components/animated-tooltip");

  await sidebar(page).evaluate((element) => {
    const scrollTo = element.scrollTo.bind(element);
    element.scrollTo = (options: ScrollToOptions | number = {}, y?: number) => {
      if (typeof options === "number") {
        element.setAttribute("data-scroll-behavior", "auto");
        scrollTo(options, y ?? 0);
      } else {
        element.setAttribute("data-scroll-behavior", options.behavior ?? "auto");
        scrollTo(options);
      }
    };
  });
  await page.getByRole("button", { name: "Search documentation..." }).click();
  await page.getByPlaceholder("Search components, templates, docs...").fill("Animated Button");
  await page.getByRole("option", { name: /Animated Button Animated CTA/ }).click();
  await expectActiveLinkInView(page, "/components/my-animated-button");
  await expect(sidebar(page)).toHaveAttribute("data-scroll-behavior", "instant");
  expect(await pageScroll(page)).toBe(0);
});

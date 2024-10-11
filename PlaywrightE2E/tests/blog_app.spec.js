const { test, expect, beforeEach, describe } = require("@playwright/test");

async function newBlog(page) {
  await page.click("[data-testid='new-blog']");
  await page.fill('input[data-testid="titleInputText"]', "New Blog Title");
  await page.fill('input[data-testid="authorInputText"]', "Blog Author");
  await page.fill('input[data-testid="urlInputText"]', "http://newblog.com");
  await page.click("[data-testid='submitButton']");
}

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    request.post("http://localhost:3003/api/testing/reset");

    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "TestUser",
        name: "Test Person",
        password: "pass12345",
      },
    });

    await page.goto("http://localhost:5173");
  });

  test("Login form is shown", async ({ page }) => {
    await page.getByRole("button", { name: "log in" }).click();
    await expect(page.getByText("username")).toBeVisible();
    await expect(page.getByText("password")).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await page.getByRole("button", { name: "log in" }).click();
      await page.getByRole("textbox").first().fill("TestUser");
      await page.getByRole("textbox").last().fill("pass12345");
      await page.getByRole("button", { name: "login" }).click();
      await expect(page.getByText("Test Person logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByRole("button", { name: "log in" }).click();
      await page.getByRole("textbox").first().fill("admin");
      await page.getByRole("textbox").last().fill("notyourfreakingbusiness");
      await page.getByRole("button", { name: "login" }).click();
      await expect(
        page.locator("text=Wrong username or password")
      ).toBeVisible();
    });
  });
});

describe("When logged in", () => {
  beforeEach(async ({ page, request }) => {
    request.post("http://localhost:3003/api/testing/reset");
    await request.post("http://localhost:3003/api/users", {
      data: {
        username: "TestUser",
        name: "Test Person",
        password: "pass12345",
      },
    });

    await page.goto("http://localhost:5173");

    await page.click("button");
    await page.getByRole("textbox").first().fill("TestUser");
    await page.getByRole("textbox").last().fill("pass12345");
    await page.getByRole("button", { name: "login" }).click();
  });

  test("a new blog can be created", async ({ page }) => {
    await newBlog(page);
    await expect(page.locator("text=New Blog Title")).toBeVisible();
  });

  test("a blog can be liked", async ({ page }) => {
    await newBlog(page);
    await page.click("[data-testid=blogDataViewToggle]");
    await page.click("[data-testid=like-button]");

    await expect(page.locator("text=Likes 1")).toBeVisible();
  });

  test("the user who added the blog can delete the blog", async ({ page }) => {
    await newBlog(page);
    await page.click("[data-testid=blogDataViewToggle]");
    page.on("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });
    await page.click("[data-testid=delete-blog]");

    await expect(page.locator("text=New Blog Title")).not.toBeVisible();
  });
});

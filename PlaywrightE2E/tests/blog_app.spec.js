const { test, expect, beforeEach, describe } = require("@playwright/test");

const testUser1 = {
  username: "DummyGuy",
  name: "John Doe",
  password: "pass12345",
};

const testUser2 = {
  username: "DummyGirl",
  name: "Jane Doe",
  password: "pass12345678",
};

const dummyBlogEntry = {
  title: "JavaScript Expert",
  author: "Milan",
  webPage: "www.tryingtestexercises.com",
};

const dummyBlogEntry2 = {
  title: "Java Beginners",
  author: "Tomas",
  webPage: "www.java.com",
};

const dummyBlogEntry3 = {
  title: "C#",
  author: "Bill",
  webPage: "www.microsoft.com",
};

async function newBlog(page, title, author, webPage) {
  await page.click("[data-testid='new-blog']");
  await page.fill('input[data-testid="titleInputText"]', title);
  await page.fill('input[data-testid="authorInputText"]', author);
  await page.fill('input[data-testid="urlInputText"]', webPage);
  await page.click("[data-testid='submitButton']");
}

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    request.post("http://localhost:3003/api/testing/reset");

    await request.post("http://localhost:3003/api/users", {
      data: {
        username: testUser1.username,
        name: testUser1.name,
        password: testUser1.password,
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
      await page.getByRole("textbox").first().fill(testUser1.username);
      await page.getByRole("textbox").last().fill(testUser1.password);
      await page.getByRole("button", { name: "login" }).click();

      await expect(page.getByText(`${testUser1.name} logged in`)).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await page.getByRole("button", { name: "log in" }).click();
      await page.getByRole("textbox").first().fill(testUser2.username);
      await page.getByRole("textbox").last().fill(testUser2.password);
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
        username: testUser1.username,
        name: testUser1.name,
        password: testUser1.password,
      },
    });

    await page.goto("http://localhost:5173");

    await page.click("button");
    await page.getByRole("textbox").first().fill(testUser1.username);
    await page.getByRole("textbox").last().fill(testUser1.password);
    await page.getByRole("button", { name: "login" }).click();
  });

  test("a new blog can be created", async ({ page }) => {
    await newBlog(
      page,
      dummyBlogEntry.title,
      dummyBlogEntry.author,
      dummyBlogEntry.webPage
    );
    await expect(page.locator(`text=${dummyBlogEntry.title}`)).toBeVisible();
  });

  test("a blog can be liked", async ({ page }) => {
    await newBlog(
      page,
      dummyBlogEntry.title,
      dummyBlogEntry.author,
      dummyBlogEntry.webPage
    );
    await page.click("[data-testid=blogDataViewToggle-view]");
    await page.click("[data-testid=like-button]");

    await expect(page.locator("text=Likes 1")).toBeVisible();
  });

  test("the user who added the blog can delete the blog", async ({ page }) => {
    await newBlog(
      page,
      dummyBlogEntry.title,
      dummyBlogEntry.author,
      dummyBlogEntry.webPage
    );

    await page.click("[data-testid=blogDataViewToggle-view]");
    page.on("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });
    await page.click("[data-testid=delete-blog]");

    await expect(
      page.locator(`text=${dummyBlogEntry.title}`)
    ).not.toBeVisible();
  });

  test("the user who added the blog sees the delete button of blog", async ({
    page,
    request,
  }) => {
    await newBlog(
      page,
      dummyBlogEntry.title,
      dummyBlogEntry.author,
      dummyBlogEntry.webPage
    );
    await page.click("[data-testid=blogDataViewToggle-view]");
    await expect(page.locator("[data-testid=delete-blog]")).toBeVisible();

    await page.click("[data-testid=logout-button]");

    await request.post("http://localhost:3003/api/users", {
      data: {
        username: testUser2.username,
        name: testUser2.name,
        password: testUser2.password,
      },
    });

    await page.click("button");
    await page.getByRole("textbox").first().fill(`${testUser2.username}`);
    await page
      .getByRole("textbox")
      .last()
      .fill(`${testUser2.username.password}`);
    await page.getByRole("button", { name: "login" }).click();

    await page.click("[data-testid=blogDataViewToggle-view]");
    await expect(page.locator("[data-testid=delete-blog]")).not.toBeVisible();
  });

  test("blogs are arranged in the order according to the likes", async ({
    page,
  }) => {
    await newBlog(
      page,
      dummyBlogEntry.title,
      dummyBlogEntry.author,
      dummyBlogEntry.webPage
    );
    await newBlog(
      page,
      dummyBlogEntry2.title,
      dummyBlogEntry2.author,
      dummyBlogEntry2.webPage
    );
    await newBlog(
      page,
      dummyBlogEntry3.title,
      dummyBlogEntry3.author,
      dummyBlogEntry3.webPage
    );
    const likeBlog = async (title, times) => {
      const blogElement = await page.locator(
        `[data-testid=blog]:has-text("${title}")`
      );
      await blogElement
        .locator("[data-testid=blogDataViewToggle-view]")
        .click();
      const likeButton = blogElement.locator('[data-testid="like-button"]');
      for (let i = 0; i < times; i++) {
        await likeButton.click();
      }
      await blogElement
        .locator("[data-testid=blogDataViewToggle-hide]")
        .click();
    };

    await likeBlog(`${dummyBlogEntry.title} by: ${dummyBlogEntry.author}`, 1);
    await likeBlog(`${dummyBlogEntry2.title} by: ${dummyBlogEntry2.author}`, 2);
    await likeBlog(`${dummyBlogEntry3.title} by: ${dummyBlogEntry3.author}`, 3);

    const blogElements = await page.locator("[data-testid=blog]").all();
    const blogLikes = [];
    for (const blogElement of blogElements) {
      await blogElement
        .locator("[data-testid=blogDataViewToggle-view]")
        .click();

      const likesText = await blogElement
        .locator("[data-testid=likes]")
        .textContent();
      const likes = parseInt(likesText.split(" ")[1], 10);
      blogLikes.push(likes);
      await blogElement
        .locator("[data-testid=blogDataViewToggle-hide]")
        .click();
    }
    expect(blogLikes).toEqual([3, 2, 1]);
  });
});

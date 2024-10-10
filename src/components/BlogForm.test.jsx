import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { test, expect, vi } from "vitest";

import BlogForm from "./BlogForm";

test("calls createBlog with the right details when a new blog is created", async () => {
  const createBlog = vi.fn();

  render(<BlogForm createBlog={createBlog} />);

  const user = userEvent.setup();

  const titleInput = screen.getByTestId("titleInputText");
  const authorInput = screen.getByTestId("authorInputText");
  const urlInput = screen.getByTestId("urlInputText");
  const submitButton = screen.getByTestId("submitButton");

  await user.type(titleInput, "Test Blog Title");
  await user.type(authorInput, "Jane Doe");
  await user.type(urlInput, "www.unittesting.org");
  await user.click(submitButton);

  expect(createBlog).toHaveBeenCalledTimes(1);
  expect(createBlog.mock.calls[0][0].title).toBe("Test Blog Title");
  expect(createBlog.mock.calls[0][0].author).toBe("Jane Doe");
  expect(createBlog.mock.calls[0][0].url).toBe("www.unittesting.org");
});

import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import userEvent from "@testing-library/user-event";

import Blog from "./Blog";

test("renders title and author, hide likes and website", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Tom",
    url: "www.",
    likes: 0,
  };

  render(<Blog blog={blog}></Blog>);
  screen.debug();

  const element = screen.getByText(
    "Component testing is done with react-testing-library by: Tom"
  );
  expect(element).toBeDefined();
  const element2 = screen.queryByText("wwww.");
  expect(element2).toBeNull();

  const element3 = screen.queryByText("likes 0 ");
  expect(element3).toBeNull();
});

test("shows URL and number of likes when the view button is clicked", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Test Person",
    url: "www.dummydatas.org",
    likes: 0,
    user: { id: "123" },
  };

  render(<Blog blog={blog} userId="123" />);

  const user = userEvent.setup();

  const button = screen.getByText("view");
  await user.click(button);

  const urlElement = screen.getByText("www.dummydatas.org");
  expect(urlElement).toBeDefined();

  const likesElement = screen.getByText("likes 0");
  expect(likesElement).toBeDefined();
});

test("calls event handler twice when the like button is clicked twice", async () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Test Person",
    url: "www.dummydatas.org",
    likes: 0,
    user: { id: "123" },
  };

  const mockHandler = vi.fn();

  render(<Blog blog={blog} userId="123" updateBlog={mockHandler} />);

  const user = userEvent.setup();

  const viewButton = screen.getByText("view");
  await user.click(viewButton);

  const likeButton = screen.getByText("like");
  await user.click(likeButton);
  await user.click(likeButton);

  expect(mockHandler).toHaveBeenCalledTimes(2);
});

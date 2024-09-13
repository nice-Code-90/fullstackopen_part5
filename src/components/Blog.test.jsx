import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";

import Blog from "./Blog";

test("renders title and author, hide likes and website", () => {
  const blog = {
    title: "Component testing is done with react-testing-library",
    author: "Tom",
    url: "www.",
    likes: 0,
  };

  render(<Blog blog={blog}></Blog>);
  screen.debug(); // Add this line to print the DOM

  const element = screen.getByText(
    "Component testing is done with react-testing-library by: Tom"
  );
  expect(element).toBeDefined();
  const element2 = screen.queryByText("wwww.");
  expect(element2).toBeNull();

  const element3 = screen.queryByText("likes 0 ");
  expect(element3).toBeNull();
});

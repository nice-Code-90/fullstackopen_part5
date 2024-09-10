import { useState } from "react";

const BlogForm = ({ createBlog }) => {
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");

  const addBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    });
  };
  return (
    <div>
      <h2>Create a new blog</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            value={newBlogTitle}
            onChange={(event) => setNewBlogTitle(event.target.value)}
          ></input>
        </div>
        <div>
          author:
          <input
            value={newBlogAuthor}
            onChange={(event) => setNewBlogAuthor(event.target.value)}
          ></input>{" "}
        </div>
        <div>
          url:
          <input
            value={newBlogUrl}
            onChange={(event) => setNewBlogUrl(event.target.value)}
          ></input>
        </div>
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default BlogForm;

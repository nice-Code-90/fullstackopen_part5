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
            data-testid="titleInputText"
            value={newBlogTitle}
            onChange={(event) => setNewBlogTitle(event.target.value)}
          />
        </div>
        <div>
          author:
          <input
            data-testid="authorInputText"
            value={newBlogAuthor}
            onChange={(event) => setNewBlogAuthor(event.target.value)}
          />
        </div>
        <div>
          url:
          <input
            data-testid="urlInputText"
            value={newBlogUrl}
            onChange={(event) => setNewBlogUrl(event.target.value)}
          />
        </div>
        <button type="submit" data-testid="submitButton">
          save
        </button>
      </form>
    </div>
  );
};

export default BlogForm;

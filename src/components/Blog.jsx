import { useState } from "react";

const Blog = ({ blog, updateBlog, userId, deleteBlog }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };
  const [buttonContent, setButtonContent] = useState("view");

  const handleViewChange = () => {
    if (buttonContent === "view") {
      setButtonContent("hide");
    } else {
      setButtonContent("view");
    }
  };

  return (
    <div style={blogStyle}>
      <div>
        {blog.title}
        <button onClick={handleViewChange}>{buttonContent}</button>
      </div>
      {buttonContent === "hide" && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}{" "}
            <button onClick={() => updateBlog(blog.id)}>like</button>
          </div>
          <div> {blog.author}</div>
          {blog.user.id === userId && (
            <div>
              <button
                onClick={() => deleteBlog(blog.id, blog.author, blog.title)}
              >
                delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default Blog;

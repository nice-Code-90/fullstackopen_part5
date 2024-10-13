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
    <div style={blogStyle} data-testid="blog" className="blog">
      <div className="blogDatas" data-testid="blog-datas">
        {blog.title}
        {" by: "}
        {blog.author}
        <button
          data-testid={
            buttonContent === "view"
              ? "blogDataViewToggle-view"
              : "blogDataViewToggle-hide"
          }
          onClick={handleViewChange}
        >
          {buttonContent}
        </button>
      </div>
      {buttonContent === "hide" && (
        <div className="togglableContent">
          <div>{blog.url}</div>
          <div data-testid="likes">
            likes {blog.likes}{" "}
            <button
              data-testid="like-button"
              onClick={() => updateBlog(blog.id)}
            >
              like
            </button>
          </div>
          {blog.user.id === userId && (
            <div>
              <button
                data-testid="delete-blog"
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

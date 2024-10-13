import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false);
  const blogFormRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = async () => {
    window.localStorage.removeItem("loggedBlogappUser");
    blogService.setToken(null);
    window.location.reload();
  };
  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({ username, password });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);

      setUser(user);
      setUsername("");
      setPassword("");
    } catch (exception) {
      setErrorMessage("Wrong username or password");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const addBlog = (newObject) => {
    blogFormRef.current.toggleVisibility();

    blogService.create(newObject).then((returnedBlog) => {
      const blogWithUser = {
        ...returnedBlog,
        user: { id: user.id },
      };
      setBlogs(blogs.concat(blogWithUser));
    });
  };

  const deleteBlog = (blogId, blogAuthor, blogTitle) => {
    if (
      window.confirm(`Do you like to delete ${blogTitle} from ${blogAuthor}`)
    ) {
      try {
        blogService.deleteBlog(blogId);
        setBlogs(blogs.filter((blog) => blog.id !== blogId));
      } catch (e) {
        console.log("error deleting blog: ", e);
      }
    }
  };

  const updateBlog = (targetedBlogId) => {
    const blogToUpdate = blogs.find((blog) => blog.id === targetedBlogId);
    const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 };

    blogService
      .update(targetedBlogId, updatedBlog)
      .then((returnedBlog) => {
        const blogWithUser = {
          ...returnedBlog,
          user: blogToUpdate.user,
        };
        setBlogs(
          blogs.map((blog) =>
            blog.id !== targetedBlogId ? blog : blogWithUser
          )
        );
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage(`Something went wrong through server updating.`);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      });
  };

  const loginForm = () => {
    const hiddenWhenVisible = { display: loginVisible ? "none" : "" };
    const showWhenVisible = { display: loginVisible ? "" : "none" };

    return (
      <div>
        <div style={hiddenWhenVisible}>
          <button
            onClick={() => {
              setLoginVisible(true);
            }}
          >
            log in
          </button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm
            username={username}
            password={password}
            handlePasswordChange={({ target }) => {
              setPassword(target.value);
            }}
            handleUsernameChange={({ target }) => {
              setUsername(target.value);
            }}
            handleSubmit={handleLogin}
          ></LoginForm>
          <button
            onClick={() => {
              setLoginVisible(false);
            }}
          >
            cancel
          </button>
        </div>
      </div>
    );
  };
  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  );
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type="error" />
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in in</p>
          <button data-testid="logout-button" onClick={handleLogout}>
            logout
          </button>

          {blogForm()}
        </div>
      )}
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            userId={user ? user.id : null}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
        ))}
    </div>
  );
};

export default App;

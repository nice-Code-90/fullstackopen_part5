import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Login from "./services/login";

const App = () => {
  const [loginVisible, setLoginVisible] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [newBlogTitle, setNewBlogTitle] = useState("");
  const [newBlogAuthor, setNewBlogAuthor] = useState("");
  const [newBlogUrl, setNewBlogUrl] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

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

  const handleLogout = async (e) => {
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

  const addNew = async (event) => {
    event.preventDefault();
    const newObject = {
      title: newBlogTitle,
      author: newBlogAuthor,
      url: newBlogUrl,
    };
    blogService.create(newObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog));
      setSuccessMessage(`a new blog ${newBlogTitle} by ${newBlogAuthor} added`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      setNewBlogTitle("");
      setNewBlogAuthor("");
      setNewBlogUrl("");
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

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={successMessage} type="success" />
      <Notification message={errorMessage} type="error" />

      <button onClick={handleLogout}>logout</button>

      <p>{user.name} logged in</p>
      <div>
        <h2>create new</h2>
        <form onSubmit={addNew}>
          <div>
            title:
            <input
              type="text"
              value={newBlogTitle}
              name="Title"
              onChange={({ target }) => {
                setNewBlogTitle(target.value);
              }}
            ></input>
          </div>
          <div>
            author:
            <input
              type="text"
              value={newBlogAuthor}
              name="Author"
              onChange={({ target }) => {
                setNewBlogAuthor(target.value);
              }}
            ></input>
          </div>
          <div>
            url:
            <input
              type="text"
              value={newBlogUrl}
              name="Url"
              onChange={({ target }) => {
                setNewBlogUrl(target.value);
              }}
            ></input>
          </div>
          <button type="submit">Add new</button>
        </form>
      </div>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;

import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage(`Hello ${user.name}👋`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      console.log('Error')
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }
  const logOut = () => {
    window.localStorage.clear()
    setUser(null)
  }
  const addBlog = (event) => {
    event.preventDefault()
    console.log(newBlog)
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url,
      likes: 2,
    }
    if (!blogObject.title || !blogObject.author || !blogObject.url) {
      alert('Please fill in all info')
    }
    blogService.create(blogObject).then((returnedBlog) => {
      setBlogs(blogs.concat(returnedBlog))
      setSuccessMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added!`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
      setNewBlog({ title: '', author: '', url: '' })
    })
  }

  const handleBlogChange = (event, property) => {
    setNewBlog({ ...newBlog, [property]: event.target.value })
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )
  const blogForm = () => (
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor="title" className="col-sm-2 col-form-label">
          Title:
        </label>
        <input
          type="text"
          value={newBlog.title}
          id="title"
          className="form-control"
          onChange={(event) => handleBlogChange(event, 'title')}
          required
        />
      </div>
      <div>
        <label htmlFor="author" className="col-sm-2 col-form-label">
          Author:
        </label>
        <input
          type="text"
          value={newBlog.author}
          id="author"
          className="form-control"
          onChange={(event) => handleBlogChange(event, 'author')}
          required
        />
      </div>
      <label htmlFor="url" className="col-sm-2 col-form-label">
        Url:
      </label>
      <input
        type="text"
        value={newBlog.url}
        id="url"
        className="form-control"
        onChange={(event) => handleBlogChange(event, 'url')}
        required
      />

      <button type="submit" className="ms-0 btn btn-light btn-sm">
        create
      </button>
    </form>
  )
  return (
    <div>
      <Notification message={errorMessage} isError={true} />
      <Notification message={successMessage} />
      {user === null && (
        <>
          <h3>Log in to an application</h3>
          {loginForm()}
        </>
      )}
      {user && (
        <div>
          <h2>Blogs</h2>
          {user.name} logged in
          <button type="submit" onClick={logOut}>
            log out
          </button>
          <p>Create new</p>
          {blogForm()}
          {blogs.map((blog) => (
            <Blog key={blog.id} blog={blog} />
          ))}
        </div>
      )}
    </div>
  )
}

export default App

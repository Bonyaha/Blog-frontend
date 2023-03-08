import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs))
  }, [])

  useEffect(() => {
    console.log('second useEffect')

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      console.log('test')
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)

      console.log('user is ' + user.name)

      const expirationTime = new Date(user.expirationDate).getTime()
      const currentTime = new Date().getTime()
      console.log(expirationTime)
      console.log(currentTime)
      console.log(expirationTime > currentTime)
      if (expirationTime < currentTime) {
        setUser(null)
        setErrorMessage('Your session has expired. Please log in again.')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }, [])

  //console.log(user)
  const blogFormRef = useRef()

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))

      blogService.setToken(user.token)
      setUser(user)
      setSuccessMessage(`Hello ${user.name}👋`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
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
  const addBlog = (newBlog) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(newBlog).then((returnedBlog) => {
      //console.log(returnedBlog)
      setBlogs(blogs.concat(returnedBlog))
      setSuccessMessage(
        `a new blog ${returnedBlog.title} by ${returnedBlog.author} added!`
      )
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    })
  }

  const addLike = (id) => {
    const blog = blogs.find((b) => b.id === id)
    const changedBlog = { ...blog, likes: ++blog.likes }
    blogService
      .update(id, changedBlog)
      .then((returnedBlog) => {
        setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
      })
      .catch(() => {
        setErrorMessage(`Blog '${blog.title}' was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setBlogs(blogs.filter((b) => b.id !== id))
      })
  }

  const sortedBlogs = (sortBy, sortOrder) => {
    const sorted = [...blogs].sort((a, b) => {
      const sortValueA = a[sortBy]
      const sortValueB = b[sortBy]

      if (sortOrder === 'desc') {
        return sortValueB > sortValueA ? 1 : -1
      } else {
        return sortValueB > sortValueA ? -1 : 1
      }
    })
    setBlogs(sorted)
  }

  const delBlog = async (id) => {
    let num = 1
    if (!id) {
      if (window.confirm('Delete these notes?')) {
        let blogsToDelete = blogs.filter((n) => n.checked === true)
        if (blogsToDelete.length > 0) {
          num = blogsToDelete.length
          const blogIds = blogsToDelete.map((n) => n.id)
          await blogService.delMany(blogIds)
          const initialBlogs = await blogService.getAll()
          setBlogs(initialBlogs)
        }
      }
    } else {
      if (window.confirm('Delete this blog?')) {
        await blogService.delMany([id])
        const initialBlogs = await blogService.getAll()
        setBlogs(initialBlogs)
      }
    }
    setSuccessMessage(`Deleted ${num} ${num > 1 ? 'notes' : 'note'}`)
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)
  }

  const handleCheck = (id) => {
    const blog = blogs.find((b) => b.id === id)
    const changedBlog = { ...blog, checked: !blog.checked }
    if (changedBlog.changed) console.log('Changed')

    blogService.update(id, changedBlog).then((returnedBlog) => {
      setBlogs(blogs.map((blog) => (blog.id !== id ? blog : returnedBlog)))
    })
  }

  const showDeleteMany = blogs.filter((b) => b.checked === true)

  return (
    <div>
      <Notification message={errorMessage} isError={true} />
      <Notification message={successMessage} />
      {user === null && (
        <>
          <h3>Log in to an application</h3>
          <Togglable buttonLabel="login">
            <LoginForm handleLogin={handleLogin} />
          </Togglable>
        </>
      )}

      {user && (
        <div>
          <h2>Blogs</h2>
          {user.name} logged in
          <button type="submit" onClick={logOut}>
            log out
          </button>
          <button type="button" onClick={() => sortedBlogs('likes', 'desc')}>
            sort⬇
          </button>
          <button type="button" onClick={() => sortedBlogs('likes', 'asc')}>
            sort⬆
          </button>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog} />
          </Togglable>
          {showDeleteMany.length > 1 ? (
            <button className="btn btn-info ms-2" onClick={() => delBlog()}>
              Delete selected
            </button>
          ) : (
            ''
          )}
          {blogs.map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              addLike={() => addLike(blog.id)}
              delBlog={() => delBlog(blog.id)}
              handleCheck={() => handleCheck(blog.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default App

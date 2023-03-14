import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      ...newBlog,
      likes: 0,
      checked: false,
    })

    setNewBlog({ title: '', author: '', url: '' })
  }

  return (
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
          onChange={(event) =>
            setNewBlog((prevState) => ({
              ...prevState,
              title: event.target.value,
            }))
          }
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
          onChange={(event) =>
            setNewBlog((prevState) => ({
              ...prevState,
              author: event.target.value,
            }))
          }
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
        onChange={(event) =>
          setNewBlog((prevState) => ({
            ...prevState,
            url: event.target.value,
          }))
        }
        required
      />

      <button type="submit" className="ms-0 btn btn-light btn-sm" id="create">
        create
      </button>
    </form>
  )
}

export default BlogForm

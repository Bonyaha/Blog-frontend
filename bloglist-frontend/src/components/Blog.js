import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLike, delBlog, handleCheck }) => {
  const [showDetails, setShowDetails] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }
  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }
  Blog.propTypes = {
    setUpdate: PropTypes.func,
    blog: PropTypes.shape({
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      likes: PropTypes.number.isRequired,
    }),
  }
  return (
    <div style={blogStyle}>
      <input
        className="form-check-input m-1"
        type="checkbox"
        id="myCheck"
        checked={blog.checked}
        onChange={handleCheck}
      ></input>
      {blog.title} {blog.author}{' '}
      <button type="button" onClick={toggleDetails}>
        {showDetails ? 'hide' : 'view'}
      </button>
      {showDetails && (
        <div>
          <p>{blog.url}</p>
          <p>
            Likes: {blog.likes}
            <button type="button" onClick={addLike}>
              like
            </button>
          </p>
          <p>{blog.user.name}</p>
          <button type="button" onClick={delBlog}>
            remove
          </button>
        </div>
      )}
    </div>
  )
}

export default Blog

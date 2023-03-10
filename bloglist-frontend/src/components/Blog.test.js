import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let blog, mockAddLike

  beforeEach(() => {
    blog = {
      title: 'Component testing is done with react-testing-library',
      author: 'Test Author',
      url: 'https://example.com',
      likes: 10,
      user: {
        name: 'Test User',
      },
    }

    mockAddLike = jest.fn()
  })

  test('renders title and author, but not URL or number of likes by default', () => {
    render(<Blog blog={blog} />)

    const titleElement = screen.getByText(
      'Component testing is done with react-testing-library Test Author'
    )
    expect(titleElement).toBeDefined()

    const urlElement = screen.queryByText(blog.url)
    expect(urlElement).toBeNull()

    const likesElement = screen.queryByText(`Likes: ${blog.likes}`)
    expect(likesElement).toBeNull()
  })

  test('clicking the button calls event handler twice', async () => {
    render(<Blog blog={blog} addLike={mockAddLike} />)

    const user = userEvent.setup()

    const show = screen.getByText('view')
    await user.click(show)

    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)
    expect(mockAddLike.mock.calls).toHaveLength(2)
  })
})

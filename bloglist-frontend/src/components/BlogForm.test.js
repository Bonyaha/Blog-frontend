import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={createBlog} />)

  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('Url:')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'Testing a form...')
  await user.type(authorInput, 'John Doe')
  await user.type(urlInput, 'http://www.example.com')
  await user.click(sendButton)

  //expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('John Doe')
  expect(createBlog.mock.calls[0][0].url).toBe('http://www.example.com')
})

import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const create = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (id, newObject) => {
  const request = await axios.put(`${baseUrl}/${id}`, newObject)
  return request.data
}
const delMany = async (blogsIds) => {
  const config = {
    headers: { Authorization: token },
  }
  await axios.delete(`${baseUrl}`, { data: { ids: blogsIds }, ...config })
}

export default {
  getAll,
  setToken,
  create,
  update,
  delMany,
}

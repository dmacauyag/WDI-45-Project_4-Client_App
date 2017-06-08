import axios from 'axios'
import jwt_decode from 'jwt-decode'

axios.defaults.baseURL = 'http://localhost:3001'

const clientAuth = {
  setTokenHeader: () => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token')
    }
  },

  signUp: (userInfo) => {
    return axios({
      url: '/api/users',
      method: 'post',
      data: userInfo
    })
    .then(res => {
      if(res.data.token) {
        localStorage.setItem('token', res.data.token)
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token')
        return jwt_decode(res.data.token)
      } else {
        return false
      }
    })
  },

  logIn: (credentials) => {
    return axios({
      url: '/api/users/login',
      method: 'post',
      data: credentials
    })
    .then(res => {
      if(res.data.token) {
        localStorage.setItem('token', res.data.token)
        axios.defaults.headers.common['x-access-token'] = localStorage.getItem('token')
        return jwt_decode(res.data.token)
      } else {
        return false
      }
    })
  },

  getCurrentUser: () => {
    const token = localStorage.getItem('token')
    return token ? jwt_decode(token) : null
  },

  logOut: () => {
    return new Promise((resolve) => {
      localStorage.clear()
      delete axios.defaults.headers.common['x-access-token']
      resolve("bye.")
    })
  },

  getBookmarks: () => {
    return axios({
      url: '/api/segments',
      method: 'get'
    })
  },

  addBookmark: (newBookmark) => {
    return axios({
      url: '/api/segments',
      method: 'post',
      data: newBookmark
    })
  },

  updateBookmarkPlus: (id) => {
    return axios({
      url: `/api/segments/${id}`,
      method: 'patch',
      data: {
        incrementor: 1
      }
    })
  },

  updateBookmarkMinus: (id) => {
    return axios({
      url: `/api/segments/${id}`,
      method: 'patch',
      data: {
        incrementor: -1
      }
    })
  },

  deleteBookmark: (id) => {
    return axios({
      url: `/api/segments/${id}`,
      method: 'delete'
    })
  }
}

clientAuth.setTokenHeader()

export default clientAuth

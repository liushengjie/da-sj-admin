import { setToken, getToken } from '@/libs/util'

export default {
  state: {
    userName: '刘胜杰',
    userId: 'liushengjie',
    avatorImgPath: '',
    token: '123',
    access: '1'
  },
  mutations: {
    setAvator (state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId (state, id) {
      state.userId = id
    },
    setUserName (state, name) {
      state.userName = name
    },
    setAccess (state, access) {
      state.access = access
    },
    setToken (state, token) {
      state.token = token
      setToken(token)
    }
  },
  actions: {
  }
}

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {}
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
    },
    auth_success(state, data) {
      state.status = 'success'
      state.token = data.token
      state.user = data.user
    },
    auth_error(state) {
      state.status = 'error'
    },
    logout(state) {
      state.status = ''
      state.token = ''
      state.user = {}
    }
  },
  actions: {
    login({commit}, data) {
      commit('auth_request')

      Vue.http.headers.common['Authentication'] = data.token
      commit('auth_success', data)

      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    },
    logout({commit}) {
        commit('logout')

        localStorage.removeItem('token')
        localStorage.removeItem('user')

        delete Vue.http.headers.common['Authentication']
    }
  },
  getters: {
    isLogged: state => !!state.token,
    user: state => state.user
  }
})

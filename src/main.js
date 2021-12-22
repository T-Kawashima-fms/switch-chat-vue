import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'

import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
const store = createStore({
  state() {
    return {
      user_session: {},
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user_session = payload
    },
  },
  plugins: [createPersistedState()],
})

import { FontAwesomeIcon } from './fontawesome/index.js'

createApp(App)
  .use(store)
  .use(router)
  // .use(socket)
  .component('fa', FontAwesomeIcon)
  .mount('#app')

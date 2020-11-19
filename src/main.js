import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
// import socket from './socket.js'

// vue-awesome
// import 'vue-awesome/icons' //アイコン全部
// import 'vue-awesome/icons/lock'
// import 'vue-awesome/icons/lock-open'
// import 'vue-awesome/icons/beer'
// import Icon from 'vue-awesome/components/Icon'

import { FontAwesomeIcon } from './fontawesome/index.js'

createApp(App)
  .use(router)
  // .use(socket)
  .component('fa', FontAwesomeIcon)
  .mount('#app')

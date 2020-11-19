import VueSocketIO from 'vue-socket.io'

const socket = new VueSocketIO({
  debug: true,
  connection: 'http://localhost:8080',
  // options: { path: '/chatroom/:roomID' },
})

export default socket

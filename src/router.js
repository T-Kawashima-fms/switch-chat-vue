import { createWebHistory, createRouter } from 'vue-router'
import Top from './views/Top'
import Chat from './views/Chat'
import Presenter from './views/Presenter'
import { isMobile } from 'mobile-device-detect'

let chatComponent = Chat
if (isMobile) chatComponent = Presenter

const routes = [
  {
    path: '/',
    name: 'top',
    component: Top,
    props: true,
  },
  {
    path: '/chatroom/:roomId',
    name: 'chat',
    component: chatComponent,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

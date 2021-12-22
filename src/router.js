import { createWebHistory, createRouter } from 'vue-router'
import Top from './views/Top'
import Chat from './views/Chat'
import Presenter from './views/Presenter'
import ConfirmDatas from './views/ConfirmDatas'
import { isMobile } from 'mobile-device-detect'

let ChatComponent = Chat
if (isMobile) ChatComponent = Presenter

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
    component: ChatComponent,
    props: true,
  },
  {
    path: '/confirmDatas',
    name: 'confirmDatas',
    component: ConfirmDatas,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

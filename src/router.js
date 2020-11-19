import { createWebHistory, createRouter } from 'vue-router'
import Top from './views/Top'
import Chat from './views/Chat'

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
    component: Chat,
    props: true,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router

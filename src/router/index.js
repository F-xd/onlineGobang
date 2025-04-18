import { createRouter, createWebHistory } from 'vue-router'

import Home from '../pages/Home.vue'
import Hall from '../pages/Hall.vue'
import Game from '../pages/Game.vue'

const routes = [
    {
        path: '/',
        redirect: '/home'
    },
    {
        path: '/home',
        name: 'Home',
        component: Home
    },
    {
        path: '/hall',
        name: 'Hall',
        component: Hall
    },
    {
        path: '/game',
        name: 'Game',
        component: Game
    }
]
export default createRouter({
  history: createWebHistory(),
  routes
})
import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/views/Home.vue'
import roomBook from '/src/views/roomBook.vue'
import roomManage from '/src/views/roomManage.vue'

const routes = [
    {path: '/', redirect: { name: 'Home' }},
    {path: '/vue-hotel-BookandManage/', name: 'Home', component: Home},
    {path: '/vue-hotel-BookandManage/roomManage', name: 'roomManage', component: roomManage},
    {path: '/vue-hotel-BookandManage/roomBook', name: 'roomBook', component: roomBook},
    {path: '/vue-hotel-BookandManage/:pathMatch(.*)*', redirect: { name: 'Home' }}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
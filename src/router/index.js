import { createRouter, createWebHistory } from 'vue-router'
import Home from '/src/views/Home.vue'
import roomBook from '/src/views/roomBook.vue'
import roomManage from '/src/views/roomManage.vue'

const routes = [
    {path: '/', name: 'Home', component: Home},
    {path: '/roomManage', name: 'roomManage', component: roomManage},
    {path: '/roomBook', name: 'roomBook', component: roomBook}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})
export default router
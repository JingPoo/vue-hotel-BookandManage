import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '/src/views/Home.vue'
import about from '/src/views/about.vue'
import roomBook from '/src/views/roomBook.vue'
import roomManage from '/src/views/roomManage.vue'
import login from '/src/views/login.vue'
import signup from '/src/views/signup.vue'
import reserve from '/src/views/reserve.vue'
import store from '../store/index'

const routes = [
    {path: '/', redirect: { name: 'Home' }},
    {path: '/vue-hotel-BookandManage/', name: 'Home', component: Home},
    {path: '/vue-hotel-BookandManage/about', name: 'about', component: about},
    {path: '/vue-hotel-BookandManage/roomBook', name: 'roomBook', component: roomBook},
    {
        path: '/vue-hotel-BookandManage/roomManage', 
        name: 'roomManage', 
        component: roomManage,
        beforeEnter(to, from){
            if(store.state.authIsReady) {
                if(store.state.user) {
                    if(store.state.user['uid'] !== 'VAeCh6Ft0MNyKKhpt0F0Srcf9B42') {
                        alert('您沒有權限瀏覽此頁，請登入管理員帳號')
                        return from
                    }
                } else {
                    alert('請先登入管理員帳號!')
                    return from
                }
            }
        },
    },
    {path: '/vue-hotel-BookandManage/login', name: 'login', component: login},
    {path: '/vue-hotel-BookandManage/signup', name: 'signup', component: signup},
    {path: '/vue-hotel-BookandManage/reserve', name: 'reserve', component: reserve},
    {path: '/vue-hotel-BookandManage/:pathMatch(.*)*', redirect: { name: 'Home' }}
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router
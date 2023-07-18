<script setup>
import { ref } from 'vue'
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const clickHandler = () => {
    store.dispatch('logout')
    router.push('/')
}
const user = computed(() => store.state.user)
const authIsReady = computed(() => store.state.authIsReady)
const menuShow = ref(false)
</script>

<template>
  <nav>
    <div class="nav-container" v-if="authIsReady">
      <h1>
            <router-link to="/" @click="menuShow = false">Jing Hotel</router-link>
      </h1>
      <div class="burger" @click="menuShow = !menuShow">
            <i class="fa-solid fa-bars" v-show="!menuShow"></i>
            <i class="fa-solid fa-x" v-show="menuShow"></i>
      </div>
      <ul class="menu">
        <li>
            <router-link to="/vue-hotel-BookandManage/roomBook" @click="menuShow = false">房間瀏覽</router-link>
        </li>
        <li>
            <i class="icon fa-solid fa-lock"></i>
            <router-link to="/vue-hotel-BookandManage/roomManage" @click="menuShow = false">房間管理</router-link>
        </li>

        <div v-if="user" class="forlogin">
            <li>
                <router-link to="/vue-hotel-BookandManage/reserve" @click="menuShow = false">我的訂單</router-link>
            </li>
            <span>{{ user.email }}</span>
            <button class="btn" @click="clickHandler">會員登出</button>
        </div>
        <div v-else class="forlogout">
          <li>
                <router-link to="/vue-hotel-BookandManage/login" @click="menuShow = false">登入</router-link>
          </li>
          <li>
             <router-link to="/vue-hotel-BookandManage/signup" @click="menuShow = false">註冊會員</router-link>
          </li>
        </div>
      </ul>

      <ul class="burgerMenu" :class="{show: menuShow}">
        <li>
            <router-link to="/vue-hotel-BookandManage/roomBook" @click="menuShow = false">房間瀏覽</router-link>
        </li>
        <li>
            <i class="icon fa-solid fa-lock"></i>
            <router-link to="/vue-hotel-BookandManage/roomManage" @click="menuShow = false">房間管理</router-link>
        </li>

        <div v-if="user" class="forlogin">
            <li>
                <router-link to="/vue-hotel-BookandManage/reserve" @click="menuShow = false">我的訂單</router-link>
            </li>
            <span> {{ user.email }}</span>
            <button class="btn" @click="clickHandler">登出</button>
        </div>
        <div v-else class="forlogout">
          <li>
                <router-link to="/vue-hotel-BookandManage/login" @click="menuShow = false">登入</router-link>
          </li>
          <li>
                <router-link to="/vue-hotel-BookandManage/signup" @click="menuShow = false">註冊會員</router-link>
          </li>
        </div>
      </ul>
    </div>
  </nav>
</template>
<style scoped lang="scss">
@import "../assets/style.scss";
nav {
  width: 100vw;
  min-width: max-content;
  height: 4rem;
  position: sticky;
  top: 0;
  z-index: 99;
  background-color: $primary;
  box-shadow: 0px 0px 5px #3a382c;

  .nav-container {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    padding: 0 2rem;

    @include md {
      padding: 0 4rem;
    }
    a {
      color: white;
      text-decoration: none;
      opacity: .8;
    }
    h1 {
      font-size: 2rem;
      width: 10rem;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .burger {
      width: min-content;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      font-size: 2rem;
      opacity: .8;
      cursor: pointer;
      position: absolute;
      right: 4rem;

      @include md {
        display: none;
      }
    }
    .menu {
      display: none;
      width: calc(100% - 6rem);
      height: 100%;
      padding-right: 30px;

      @include md {
        display: flex;
        justify-content: flex-end;
      }
      li {
        width: max-content;
        padding: 0 2rem;
        display: flex;
        justify-content: center;
        align-items: center;

        a {
          font-size: 1.6rem;
        }
        a.router-link-active,
        a:hover {
          opacity: 1;
          font-weight: bold;
        }
      }
      .forlogin {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        span {
            color: white;
            font-size: 1.2rem;
        }
        button {
            height: 2.4rem;
            font-size: 1.2rem;

            &:hover {
                font-weight: bold;
                color: white;
                background-color: #8b804d;
            }
        }
      }
      .forlogout {
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    .burgerMenu {
      width: 100vw;
      height: max-content;
      background-color: lighten($primary, 5);
      display: flex;
      flex-direction: column;
      align-items: center;
      border-top: 2px solid darken($primary, 20);
      border-bottom: 2px solid darken($primary, 20);
      position: absolute;
      top: 100%;
      left: 100%; 
      transition: all .3s ease;

      @include md {
        display: none;
      }
      &.show {
        transform: translateX(-100%);
      } 
      li {
        width: max-content;
        padding: 1rem 0;
        display: flex;
        align-items: center;

        a {
          font-size: 1.6rem;
        }
        a.router-link-active,
        a:hover {
          opacity: 1;
          font-weight: bold;
        }
      }
      li + li {
        border-top: 2px solid darken($primary, 10);
      }
      .forlogin {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0;
        border-top: 2px solid darken($primary, 10);

        span {
            color: white;
            font-size: 1.2rem;
        }
        button {
            height: 2.4rem;
            font-size: 1.2rem;

            &:hover {
                font-weight: bold;
                color: white;
                background-color: #8b804d;
            }
        }
      }
      .forlogout {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-top: 2px solid darken($primary, 10);
      }
    }
  }
}
.icon {
    color: white;
    padding-right: 2px;
}
</style>
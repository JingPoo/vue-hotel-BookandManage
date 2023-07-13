<script setup>
import { ref } from 'vue'
const menuShow = ref(false)
</script>

<template>
  <nav>
    <div class="nav-container">
      <h1>
        <router-link to="/" @click="menuShow = false">飯店首頁</router-link>
      </h1>
      <div class="burger" @click="menuShow = !menuShow">
        <i class="fa-solid fa-bars" v-show="!menuShow"></i>
        <i class="fa-solid fa-x" v-show="menuShow"></i>
      </div>
      <ul :class="{show: menuShow}">
        <li>
          <router-link to="/vue-hotel-BookandManage/roomBook" @click="menuShow = false">房間瀏覽</router-link>
        </li>
        <li>
          <router-link to="/vue-hotel-BookandManage/roomManage" @click="menuShow = false">房間管理</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <div class="view-container">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import "./assets/style.scss";

* {
  padding: 0;
  margin: 0;
  list-style: none;
  box-sizing: border-box;
}
html,body {
  height: 100vh; 
}
body {
  background-color: #edecea;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
}
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
    ul {
      display: none;
      width: calc(100% - 6rem);
      height: 100%;
      padding-right: 30px;
      @include md {
        display: flex;
        justify-content: flex-end;
      }

      &.show {
        transform: translateY(4rem);
        width: 100vw;
        height: max-content;
        background-color: lighten($primary, 5);
        display: flex;
        flex-direction: column;
        align-items: center;
        border-top: 2px solid darken($primary, 20);
        border-bottom: 2px solid darken($primary, 20);
        position: absolute;
        left: 0; 

        li {
          width: max-content;
          padding: 1rem 0;
        }
        li + li {
          border-top: 2px solid darken($primary, 10);
        }
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
    }
  }
}
.view-container{
  width: 100vw;
  max-width: 1560px;
  min-width: max-content;
  margin: auto;
}
</style>

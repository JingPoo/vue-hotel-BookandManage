<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<template>
  <Navbar></Navbar>
  <div class="view-container">
    <router-view v-slot="{ Component }">
      <Transition appear name="fade" mode="out-in">
        <component :is="Component"></component>
      </Transition>
    </router-view>
  </div>
</template>

<style lang="scss">
@import "./assets/style.scss";
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@100;300;400;500;700;900&family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;0,1000;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900;1,1000&display=swap');
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
  background-color: $secondary;
  position: relative;
  overflow-x: hidden;
  overflow-y: scroll;
  font-family: 'Nunito','Noto Sans TC',  sans-serif;
}
.view-container{
  width: 100vw;
  max-width: 1560px;
  min-width: max-content;
  margin: auto;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-enter-active {
  transition: all .2s ease-out;
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-leave-active {
  transition: all .2s ease-in;
}
</style>

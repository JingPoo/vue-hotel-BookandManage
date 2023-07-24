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

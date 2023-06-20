<script setup>
</script>

<template>
  <nav>
    <div class="nav-container">
      <router-link to="/">首頁</router-link>
      <router-link to="/roomBook">房間瀏覽</router-link>
      <router-link to="/roomManage">房間管理</router-link>
    </div>
  </nav>
  <div class="view-container">
    <router-view></router-view>
  </div>
</template>

<style>
  *{
    padding: 0;
    margin: 0;
    list-style: none;
    box-sizing: border-box;
  }
  html,body{
    height: 100vh;
    width: 100vw;
  }
  body{
    /* background: linear-gradient(60deg, #e6dec0 , #edecea); */
    background-color: #edecea;
    padding-top: 50px;
    position: relative;
  }
  nav{
    width: 100%;
    min-width: 400px;
    height: 50px;
    position: absolute;
    top: 0;
    background-color: #b6a96a;
    box-shadow: 0px 0px 5px #3a382c;
  }
  .nav-container{
    width: 100%;
    height: 100%;
    padding: 10px 20px;
    display: flex;
    justify-content: flex-start;
  }
  nav a{
    font-size: 20px;
    margin-left: 50px;
    text-decoration: none;
    color: white;
    opacity: .7;
  }
  nav a.router-link-active,
  nav a:hover{
    opacity: 1;
    font-weight: bold;
  }
  .view-container{
    width: 100%;
    max-width: 1440px;
    min-width: 400px;
    margin: auto;
  }

  /* For Mobile */
  @media all and (max-width: 414px){
    .nav-container{
      justify-content: center;
    }
  }
</style>

<template>
  <div id="app">
    <nav>
      <router-link to="/register">注册</router-link> |
      <router-link to="/login">登录</router-link> |
      <router-link to="/about">关于</router-link> |
      <router-link to="/home">主页</router-link>
    </nav>
    <transition name="page-fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

/* 添加以下代码定义过渡效果 */
.page-fade-enter-active, .page-fade-leave-active {
  transition: opacity 0.5s;
}
.page-fade-enter, .page-fade-leave-to {
  opacity: 0;
}
</style>

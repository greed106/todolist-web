import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';

// 使用 ElementUI 插件
Vue.use(ElementUI);

// 将 axios 附加到 Vue 的原型上
Vue.prototype.$axios = axios;

// 如果存在 jwt token，则设置默认的请求头
const jwt = localStorage.getItem('jwt');
if (jwt) {
  Vue.prototype.$axios.defaults.headers.common['Authorization'] = jwt;
}
document.title = 'ToDoList';
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

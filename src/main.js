import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'


import PageNotFound from './views/Page404.vue'
import todo from './views/todoList.vue'
import AboutView from './views/AboutView.vue'
import HomeView from './views/HomeView.vue'


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(ElementUI);

const routes = [
  { path: '/', component: HomeView },
  { path: '/about', component: AboutView },
  { path: '/todo', component: todo },
  { path: "*", component: PageNotFound },
  
];

const router = new VueRouter({
  routes,
  mode: 'history'
})


new Vue({
  render: h => h(App),
  router,
}).$mount('#app')

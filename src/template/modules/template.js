// import Vue from 'vue';
// import iView from 'iview';
// import VueRouter from 'vue-router';
// import axios from 'axios';
// import Routers from './router';
// import App from '../../components/app.vue';
// import 'utils/httpRequest.js';
// import '../../base.js';
// import '../../components/base/install.js';
// Vue.use(VueRouter);
// Vue.use(iView);

// // 路由配置
// const RouterConfig = {
//     routes: Routers
// };
// const router = new VueRouter(RouterConfig);

// router.beforeEach((to, from, next) => {
//     iView.LoadingBar.start();
//     document.title = to.meta.title;
//     next();
// });

// router.afterEach((to, from, next) => {
//     iView.LoadingBar.finish();
//     window.scrollTo(0, 0);
// });

// let vm = new Vue({
//     el: '#app',
//     router: router,
//     render: h => h(App)
// });
//以上为该文件模版，去掉注释进行修改
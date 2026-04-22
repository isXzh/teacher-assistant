import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import axios from "axios";
import 'element-ui/lib/theme-chalk/index.css'
import './assets/styles/index.css'
Vue.prototype.axios = axios;
axios.get("/static/config.json").then((res) => {
  window.businessURL = res.data.api.businessURL;
});
Vue.use(ElementUI)
Vue.use(router)
Vue.use(store)

Vue.config.productionTip = false

Vue.prototype.$message = ElementUI.Message
Vue.prototype.$notify = ElementUI.Notification
Vue.prototype.$confirm = ElementUI.MessageBox.confirm
Vue.prototype.$alert = ElementUI.MessageBox.alert
async function bootstrap() {
  try {
    // 加载配置文件
    const response = await axios.get("/static/config.json");
    window.businessURL = response.data.api.businessURL;
    console.log("配置加载完成:", window.businessURL);

    // 配置加载完成后启动应用
    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  } catch (error) {
    console.error("配置加载失败，使用默认配置:", error);
    // 降级：使用默认配置
    window.businessURL = "http://120.55.72.186:8081";

    new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  }
}

// 启动应用
bootstrap();
// new Vue({
//   router,
//   store,
//   render: h => h(App)
// }).$mount('#app')

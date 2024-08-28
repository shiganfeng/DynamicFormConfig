import { createApp } from 'vue';
import './assets/styles/main.css';

import App from './App.vue';
import antDesignVueComponents from "./ant-design-vue-components.js";
import dayjs from "dayjs";
import 'dayjs/locale/zh-cn';
import router from "./route/route.js";
import pinia from "./store/store.js";

// 设置全局 dayjs 语言为中文
dayjs.locale('zh-cn');

const app = createApp(App);

app.use(antDesignVueComponents);
app.use(router);
app.use(pinia);

app.mount('#app');

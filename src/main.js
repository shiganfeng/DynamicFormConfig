import { createApp } from 'vue';
import './assets/styles/main.css';

import App from './App.vue';
import antDesignVueComponents from "./ant-design-vue-components.js";
import router from "./route/route.js";
import pinia from "./store/store.js";

const app = createApp(App);

app.use(antDesignVueComponents);
app.use(router);
app.use(pinia);

app.mount('#app');

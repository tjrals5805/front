import './assets/common.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import axios from "axios";
import {registerGrid} from "@mescius/wijmo.vue2.grid";


const app = createApp(App)
app.config.globalProperties.$axios = axios;
app.config.globalProperties.$serverUrl = '//localhost:8080'
app.use(router).mount('#app')
registerGrid(app)
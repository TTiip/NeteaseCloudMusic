import '@/assets/css/global.css'
import '@/assets/fonts/font.css'
import '@/assets/less/reset.less'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

createApp(App).use(store).use(router).mount('#app')

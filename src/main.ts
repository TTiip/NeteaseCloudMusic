import '@/assets/css/global.css'
import '@/assets/fonts/font.css'
import '@/assets/less/reset.less'

import 'element-plus/dist/index.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import useDirective from '@/hooks/useDirective'

// 此时会自动引入对应的样式文件，无需再手动逐一引入
import {
  // 组件
  ElButton,
  ElRow,
  ElCol,
  ElPopover,
  ElInput,
  ElImage,
  ElMenu,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDialog,
  ElForm,
  ElFormItem,
  ElCarouselItem,
  ElCarousel,
  ElPagination,
  ElSwitch,
  // 插件
  ElInfiniteScroll,
  ElLoading,
  ElHeader,
  ElMain,
  ElContainer
} from 'element-plus'

// 创建实例
const app = createApp(App)
// 使用hook生成自定义指令
useDirective(app)

// 注册特定组件
;[
  ElButton,
  ElRow,
  ElCol,
  ElPopover,
  ElInput,
  ElImage,
  ElMenu,
  ElDropdown,
  ElDropdownMenu,
  ElDropdownItem,
  ElDialog,
  ElForm,
  ElFormItem,
  ElCarouselItem,
  ElCarousel,
  ElPagination,
  ElSwitch,
  ElHeader,
  ElMain,
  ElContainer
].map(item => app.component(item.name, item))

;[
  ElInfiniteScroll,
  ElLoading
].map(item => app.use(item))
// 全局设置尺寸。
app.config.globalProperties.$ELEMENT = { size: 'small' }

app.use(store).use(router).mount('#app')

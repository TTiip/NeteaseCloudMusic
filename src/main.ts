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
  ElMessage,
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
  ElPagination
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
  ElPagination
].map(item => app.component(item.name, item))
// 全局设置尺寸。
app.config.globalProperties.$ELEMENT = { size: 'small' }
// 在vue实例上挂在属性，不推荐这么用，但是要使用message每个文件都要引入有点 小烦。
app.config.globalProperties.$message = ElMessage

app.use(store).use(router).mount('#app')

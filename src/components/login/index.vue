<template>
  <div class='login'>
      <!-- :close-on-press-escape='false'
      :close-on-click-modal='false' -->
    <el-dialog
      v-model="showForm"
      width="30%"
      @close='closeDialog'
    >
      {{ loginForm }}
      <div class="login-wrapper">
        <img src="@/assets/logo.jpg" alt="" class="login-logo">
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
          <el-form-item prop="phone">
            <el-input v-model="loginForm.email" placeholder="请输入网易云帐号登录">
              <template #prefix>
                <i class="iconfont icon-phone"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input v-model="loginForm.password" placeholder="请输入密码" show-password>
              <template #prefix>
                <i class="iconfont icon-pwd"></i>
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitClick">登录</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { reactive, computed, defineEmits } from 'vue'
import store from '@/store'

const showForm = computed(() => !store.state.isLogin)
//
const loginForm = reactive({
  email: '',
  password: ''
})

const emmiter = defineEmits(['closeDialog'])

const closeDialog = () => {
  console.log(33333)
  emmiter('closeDialog', false)
}

const loginFormRules = {
  email: [{ required: true, message: '请输入网易帐号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入网易密码', trigger: 'blur' }]
}

const submitClick = () => {
  console.log(loginForm)
}

// export default {
//   components: {},
//   data () {
//     // 这里存放数据
//     return {
//       loginDialogVisible: true,
//       loginForm: {
//         phone: '',
//         pwd: ''
//       },
//       loginFormRules: {
//         phone: [{ required: true, message: '请输入网易帐号', trigger: 'blur' }],
//         pwd: [{ required: true, message: '请输入网易密码', trigger: 'blur' }]
//       }
//     }
//   },
//   // 方法集合
//   methods: {}
// }
</script>
<style scoped lang="less">
@import './index.less';
</style>

<template>
  <div class='login'>
    <el-dialog v-model="isLoginClick" width="30%">
      {{ loginForm }}
      <div class="login-wrapper">
        <img src="@/assets/logo.jpg" alt="" class="login-logo">
        <!-- :rules="loginFormRules" -->
        <el-form ref="loginFormRef" :model="loginForm">
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
import { defineProps, defineEmits, reactive } from 'vue'

defineProps({
  isLoginClick: {
    type: Boolean,
    required: true
  }
})

//
const loginForm = reactive({
  email: '',
  password: ''
})

const emit = defineEmits(['submitForm'])

const submitClick = () => {
  emit('submitForm', loginForm)
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

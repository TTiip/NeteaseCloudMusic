<template>
  <div class='login'>
    <el-dialog
      v-model="showForm"
      width="30%"
      @close='closeDialog'
    >
      {{ loginForm }}
      <div class="login-wrapper">
        <img src="@/assets/logo.jpg" alt="" class="login-logo">
        <el-form ref="FormRef" :model="loginForm" :rules="loginFormRules">
          <el-form-item prop="email">
            <el-input v-model="loginForm.email" placeholder="请输入网易云帐号登录">
              <template #prefix>
                <i class="iconfont icon-phone"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
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
import { ref, reactive, computed, defineEmits } from 'vue'
import store from '@/store'

const showForm = computed(() => !store.state.isLogin)
//
const loginForm = reactive({
  email: '',
  password: ''
})

const loginFormRules = {
  email: [{ required: true, message: '请输入网易帐号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入网易密码', trigger: 'blur' }]
}

const emmiter = defineEmits(['closeDialog'])

const closeDialog = () => {
  emmiter('closeDialog', false)
}

const FormRef = ref<any>(null)
const submitClick = () => {
  FormRef.value.validate((valid: boolean) => {
    if (valid) {
      alert('submit!')
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

// refs[formName].validate((valid) => {
//   if (valid) {
//     alert('submit!')
//   } else {
//     console.log('error submit!!')
//     return false
//   }
// })

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

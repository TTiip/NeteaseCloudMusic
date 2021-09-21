<template>
  <div class="login">
    <el-dialog
      v-model="showForm"
      width="30%"
      @close="closeDialog"
    >
      <div class="login-wrapper">
        <img
          src="@/assets/logo.jpg"
          alt=""
          class="login-logo"
        >
        <el-form
          ref="FormRef"
          :model="loginForm"
          :rules="loginFormRules"
        >
          <el-form-item prop="phone">
            <el-input
              v-model="loginForm.phone"
              placeholder="请输入手机帐号登录"
            >
              <template #prefix>
                <i class="iconfont icon-phone" />
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="请输入密码"
              show-password
            >
              <template #prefix>
                <i class="iconfont icon-pwd" />
              </template>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div>
          111
          <el-checkboxs
            v-model="saveAccountPassword"
            label="记住账号密码"
          />
        </div>
        <div class="dialog-footer">
          <el-button
            type="primary"
            @click="submitClick"
          >
            登录
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import useMessage from '@/hooks/useMessage'
import { setSessionStorage } from '@/hooks/useSessionStorage'
// import cryptoJs from 'crypto-js'
import store from '@/store'
import axios from '@/axios'

const saveAccountPassword = ref(false)

const showForm = computed(() => !store.state.isLogin)
//
const loginForm = reactive({
  phone: '',
  password: ''
})

const loginFormRules = {
  phone: [{ required: true, message: '请输入网易帐号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入网易密码', trigger: 'blur' }]
}

const emmiter = defineEmits(['closeDialog'])

const closeDialog = () => {
  emmiter('closeDialog', false)
}

const FormRef = ref<any>(null)
const submitClick = () => {
  FormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      const res = await axios({
        url: 'cellPhoneLogin',
        method: 'get',
        params: {
          phone: loginForm.phone,
          // 加密调用后台后台有时候会报错，所以现在先使用不加密。
          // md5_password: cryptoJs.MD5(loginForm.password).toString()
          password: loginForm.password
        }
      })
      if (res.code === 200) {
        useMessage('success', '登录成功')
        const userDetail = await axios({
          url: 'getuserDetail',
          method: 'GET',
          params: {
            uid: res.account.id
          }
        })
        // 设置登录相关信息
        store.commit('setLogin', true)
        store.commit('setUserInfo', userDetail.profile)
        // 存储session
        setSessionStorage('token', res.token)
        setSessionStorage('cookie', res.cookie)
        setSessionStorage('isLogin', true)
        setSessionStorage('userInfo', JSON.stringify(userDetail.profile))
      }
    } else {
      console.log('error submit!!')
      return false
    }
  })
}
</script>
<style scoped lang="less">
@import './index.less';
</style>

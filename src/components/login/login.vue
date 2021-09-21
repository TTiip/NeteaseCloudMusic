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
        <div style="text-align: right;">
          是否记住账号密码: <el-switch
            v-model="isSave"
            active-color="#ff641e"
            @change="changeIsSave"
          />
        </div>
      </div>
      <template #footer>
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
import { setLocalStorage } from '@/hooks/useLocalStorage'
// import cryptoJs from 'crypto-js'
import store from '@/store'
import axios from '@/axios'

const showForm = computed(() => !store.state.isLogin)
const compuntedIsSave = computed(() => store.state.isSave)
const compuntedPhone = computed(() => store.state.phone)
const compuntedPassword = computed(() => store.state.password)
const isSave = ref(compuntedIsSave.value === 'true')

const changeIsSave = (isSave: boolean) => {
  store.commit('setIsSave', isSave)
}

const loginForm = reactive({
  phone: compuntedPhone.value,
  password: compuntedPassword.value
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
        if (isSave.value) {
          setLocalStorage('PhoneAndPassword', JSON.stringify({ phone: loginForm.phone, password: loginForm.password }))
        } else {
          setLocalStorage('PhoneAndPassword', '')
        }
        loginForm.phone = ''
        loginForm.password = ''
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

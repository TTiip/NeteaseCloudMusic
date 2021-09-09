<template>
  <div class="login">
    {{ props.form }}
    <el-form label-width="80px">
      <el-form-item label="邮箱">
        <el-input v-model="props.form.email"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="props.form.password"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  }
})

console.log(props, 'props')

</script>

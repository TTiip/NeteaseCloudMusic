<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
  </div>
</template>

<script lang="ts" setup>
import axios from '@/axios'

axios.get('/api/search/hot')
  .then((res: any) => console.log(res))

</script>

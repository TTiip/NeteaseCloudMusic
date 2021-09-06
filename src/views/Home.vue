<template>
  <div class="home"></div>
</template>

<script lang="ts" setup>
import axios from '@/axios'

axios.get('/api/search/hot')
  .then((res: any) => console.log(res))

</script>

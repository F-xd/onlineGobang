<template>
  <div class='app'>
    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

</script>

<style lang='less' scoped>
.app {
  width: 100%;
  height: 100%;
  background:linear-gradient(to bottom, #fff7f7, #ffcbed);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
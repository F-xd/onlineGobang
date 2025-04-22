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
  min-width: 300px;
  min-height: 500px;
  overflow: auto;
  background:linear-gradient(to bottom, #fff7f7, #ffcbed);
  display: flex;
}
</style>
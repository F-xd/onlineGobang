<template>
  <div class='message'>
    <p>{{ message }}</p>
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
const props = defineProps({
    message: {
        type: String,
        default: ''
    }
});
</script>

<style lang='less' scoped>
.message {
    padding: 20px 30px;
    background-color: rgb(255, 255, 255);
    border-radius: 10px;
    border: 1.5px solid #000000;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    z-index: 1000;
    top: 50%;
    transform: translateY(-50%);
    >p{
        font-size: 20px;
        padding: 10px 0 ;
        margin-bottom: 20px;
    }
}
</style>
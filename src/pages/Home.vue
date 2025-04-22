<template>
  <div class='home'>
    <Message v-show="isShow" :message="'请填写昵称和个性签名'">
        <button @click="isShow = false">确定</button>
    </Message>
    <div v-show="isShow" class="disabled"></div>
    <h1 class="title">五子棋联机版</h1>
    <div class="form">
        <input type="text" v-model="player.name" placeholder="请输入昵称">
        <input type="text" v-model="player.desc" placeholder="请输入个性签名">
        <button @click="joinHall">加入大厅</button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive} from 'vue';
import { useRouter } from 'vue-router';
import Message from '../components/Message.vue';
import { useGameData } from '../store/gameData';
const router = useRouter();
const gameData = useGameData();
const isShow = ref(false)
const player = reactive({
    name:'',
    desc:''
})
const joinHall = () => {
    if(player.name.trim() === ''||player.desc.trim() === ''){
        isShow.value = true
        return;
    }else{
        gameData.setPlayerInfo(player);
        // console.log(gameData.playerInfo);
        // 跳转至游戏大厅
        router.push('/hall');
    }
}
</script>

<style lang='less' scoped>
.home {
    min-width: 300px;
    width: 30%;
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.59);
    border-radius: 20px;
    padding: 20px;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
.disabled{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;
}
.title{
    color: rgb(246, 184, 239);
    text-shadow: 1px 2px 2px #979797;
}
.form{
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    >input,>button{
        border: none;
        width: 100%;
        height: 40px;
        border-radius: 8px;
        box-sizing: border-box;
        padding: 0 20px;
        outline: none;
        font-size: 20px;
        font-weight: bold;
        box-shadow: 2px 2px 2px #979797;
    }
    >button{
        background-color: rgb(255, 218, 251);
        cursor: pointer;
        &:hover{
            background-color: rgb(246, 184, 239);
            color: #ffffff;
        }
    }
}
</style>
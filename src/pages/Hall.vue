<template>
    <div class='hall'>
        <div v-for="player,index in playerInfoList" :key="index">
            <div class='player'>
                <p>{{player.name}}</p>
                <p>{{player.desc}}</p>
                <!-- <p>{{ player.clientInfo }}</p> -->
                <p>{{ gameData.playerInfo.clientInfo }}</p>
                <button v-show="player.name != gameData.playerInfo.name">邀请</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useGameData } from '../store/gameData';
const gameData = useGameData();
const playerInfoList = ref([]);
//连接到大厅服务器
const socket = new WebSocket('ws://localhost:8080');
// 发送消息给服务器
const sendMessagetoServer = (type,data) => {
    socket.send(JSON.stringify({type,data}));
}
// 接收服务器消息
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch(data.type){
        case 'updatePlayerInfo':{
            console.log(data);
            gameData.setPlayerInfo(data.data);
            console.log(gameData.playerInfo);
            break;
        }
        case 'playerInfoList':{
            playerInfoList.value = data.playerInfoList;
            console.log(playerInfoList.value);
            console.log(gameData.playerInfo);
        }
    }
}

socket.onopen = () => {
    console.log('连接成功');
    // 发送登录消息
    sendMessagetoServer('playerInfo',gameData.playerInfo);
}

</script>

<style lang='less' scoped>
.hall {
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
}
</style>
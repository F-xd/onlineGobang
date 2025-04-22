<template>
    <div class='hall'>
        <Message v-show="isShow" :message='inviteMessage.name+"邀请你加入对局"'>
            <button @click="isShow = false">拒绝</button>
            <button @click="acceptInvite">接受</button>
        </Message>
        <div v-show="isShow" class="disabled"></div>
        <div class="mine">
            <span>昵称</span>
            <p>{{ gameData.playerInfo.name }}</p>
            <span>签名</span>
            <p>{{ gameData.playerInfo.desc }}</p>
        </div>
        <h2>玩家列表</h2>
        <ul class="players">
            <li class="header">
                <p>昵称</p>
                <p>签名</p>
                <p>操作</p>
            </li>
            <li v-show="player.clientInfo != gameData.playerInfo.clientInfo" v-for="player,index in playerInfoList" :key="index" class='player'>
                <p>{{player.name}}</p>
                <p>{{player.desc}}</p>
                <p><button @click="invite(player.clientInfo)">邀请</button></p>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import { useGameData } from '../store/gameData';
import { useRouter } from 'vue-router';
import Message from '../components/Message.vue';
const isShow = ref(false)
const inviteMessage = ref([]);
const router = useRouter();
const gameData = useGameData();
const playerInfoList = ref([]);
//连接到大厅服务器
const socket = new WebSocket('ws://10.9.69.137:8080');
// 发送消息给服务器
const sendMessagetoServer = (type,data) => {
    socket.send(JSON.stringify({type,data}));
}

// 接收服务器消息
socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    switch(message.type){
        case 'updatePlayerInfo':{
            gameData.setPlayerInfo(message.data);
            break;
        }
        case 'playerInfoList':{
            playerInfoList.value = message.data;
            break;
        }
        case 'invite':{
            console.log(message.data);
            inviteMessage.value = message.data;
            inviteMessage.value.name = playerInfoList.value.find(player=>player.clientInfo === inviteMessage.value.clientInfo)?.name;
            isShow.value = true;
            break;
        }
        case 'roomReady':{
            gameData.setRoomCode(message.data.roomCode);
            router.push('/game');
            break;
        }
    }
}

// 连接到服务器
socket.onopen = () => {
    console.log('连接成功');
    // 发送登录消息
    sendMessagetoServer('newPlayerInfo',gameData.playerInfo);
}
// 断开连接
onBeforeUnmount(()=>{
    socket.close();
})

// 邀请对手
const invite = (clientInfo)=>{
    console.log('邀请对手',clientInfo);
    
    sendMessagetoServer('invite',{clientInfo});
}

// 接受邀请
const acceptInvite = ()=>{
    console.log('接受邀请');
    gameData.setRoomCode(inviteMessage.value.roomCode);
    isShow.value = false;
    router.push('/game');
}
</script>

<style lang='less' scoped>
.hall {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.disabled{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: transparent;
}
.mine{
    padding: 20px;
    background-color: #ffeaf8;
    box-shadow: 1px 1px 5px #ffffff;
    border-radius: 15px;
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    span{
        font-weight: bold;
        font-size: 18px;
        color: #000000;
        margin-top: 10px;
    }
}
.players{
    width: 100%;
    display: flex;
    flex-direction: column;
    .header{
        font-weight: bold;
    }
    overflow: auto;
    li{
        width: 100%;
        display: flex;
        justify-content: center;
        padding: 20px 0;
        border-bottom:1.5px solid #000000;
        p{
            width: 30%;
            text-align: center;
            //溢出省略号
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            button{
                background-color: #ffffff;
                border: none;
                color: #464646;
                border-radius: 5px;
                padding: 5px 10px;
                &:hover{
                    background-color: #e4e4e4;
                    color: #000000;
                }
            }
        }
    }
}
</style>
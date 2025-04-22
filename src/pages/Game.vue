<template>
  <div class='game'>
    <Chessboard v-if="gameData.game.state == 'playing'" @pieceClick="(x, y, color) => judgeVictory(x, y, color)"
      :chessArr="chessArr"></Chessboard>
    <div v-else class="ready">
      <div v-if="gameData.game.state == 'waiting'">等待对方加入...</div>
      <div v-else>
        <span>{{ gameData.game.players[0].ready ? '已准备' : '等待' }}</span>
        <button @click="reset()&&sendMessagetoServer('ready')">{{ '准备' }}</button>
        <span>{{ gameData.game.players[1].ready ? '已准备' : '等待' }}</span>
      </div>
    </div>
    <div v-show="winner" class="message">
      <p>恭喜{{ winner }}获胜!</p>
      <button @click="winner='';gameData.game.state='readying';">再来一局</button>
    </div>
    <div class='control'>
      <div class="player">
        <div class="p1">{{ gameData.game.players[0]?.name }}</div>
        <div class="score">
          <div>
            <div class="turned" :class="{ 't1': gameData.game.currentColor == 1, 't2': gameData.game.currentColor == 2 }" v-show="gameData.game.players[gameData.game.currentTurn].clientInfo==gameData.game.players[0].clientInfo"></div>
          </div>
          <h1>{{ score[0] }}:{{ score[1] }}</h1>
          <div>
            <div class="turned" :class="{ 't1': gameData.game.currentColor == 1, 't2': gameData.game.currentColor == 2 }" v-show="gameData.game.players[gameData.game.currentTurn].clientInfo==gameData.game.players[1].clientInfo"></div>
          </div>
        </div>
        <div class="p2">{{ gameData.game.players[1]?.name }}</div>
      </div>
      <div class="btn">
        <button @click="reset">重新开局</button>
        <button @click="retract">悔棋</button>
        <button @click="clear">清空比分</button>
        <button @click="giveUp">认输</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import { useGameData } from '../store/gameData';
import ControlView from '../components/ControlView.vue';
import Chessboard from '../components/Chessboard.vue';
const gameData = useGameData();
//连接到对局服务
const socket = new WebSocket('ws://10.9.69.137:' + gameData.roomCode);
// 发送消息给服务器
const sendMessagetoServer = (type, data) => {
  socket.send(JSON.stringify({ type, data }));
}


const SIZE = 20;
const chessArr = reactive(new Array(SIZE).fill(0).map(() => new Array(SIZE).fill(0)));
const state = ref(1);
const score = reactive(JSON.parse(localStorage.getItem('score') || '[0,0]'));
const playerName = reactive(JSON.parse(localStorage.getItem('playerName') || '["",""]'));
const sequence = reactive([1, 2])
const winner = ref('');
const rules = [
  { x: 0, y: 1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 }
]
const stepList = reactive([]);
// 判断是否越界
const boundary = (x, y) => {
  if (x < 0 || x >= SIZE || y < 0 || y >= SIZE) return false;
  else return true;
}
// 判断是否获胜
const judgeVictory = (x, y, color) => {
  console.log(x, y, color);
  gameData.setChessArr(x, y, color);
  // 记录走过的步
  // stepList.push({ x, y });
  // 判断是否有五子连线
  for (let i = 0; i < rules.length; i++) {
    let count = 1;
    let xx = x;
    let yy = y;
    while (boundary(xx + rules[i].x, yy + rules[i].y)) {
      xx += rules[i].x;
      yy += rules[i].y;
      if (gameData.chessArr[xx][yy] == color) {
        count++;
      }
      else break;
    }
    xx = x;
    yy = y;
    while (boundary(xx - rules[i].x, yy - rules[i].y)) {
      xx -= rules[i].x;
      yy -= rules[i].y;
      if (gameData.chessArr[xx][yy] == color) {
        count++;
      }
      else break;
    }
    if (count >= 5) {
      winner.value = color == 1 ? '黑棋' : '白棋';
      sendMessagetoServer('win', {x,y});
      // let index = sequence.indexOf(state.value);
      // score[index]++;
      // save();
      return true;
    }
  }
  console.log('发送')
  sendMessagetoServer('update', { x, y });
  return false;
}
const clear = () => {
  localStorage.removeItem('score');
  localStorage.removeItem('playerName');
  score.fill(0);
}
// 重置棋盘
const reset = () => {
  // 重置棋盘
  gameData.chessArr.forEach(row => row.fill(0));
  // stepList.splice(0, stepList.length);
  winner.value = '';
  return true;
}


/////////////////////////////////////////////


socket.onopen = () => {
  console.log('连接成功');
  sendMessagetoServer('join', gameData.playerInfo);
}

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  switch (message.type) {
    case 'updatePlayerInfo': {
      gameData.setPlayerInfo(message.data);
      break;
    }
    case 'game': {
      console.log(message.data);
      gameData.setGame(message.data);
      break;
    }
    case 'update': {
      gameData.setChessArr(message.data.x, message.data.y, message.data.color);
      break;
    }
    case 'win': {
      gameData.setChessArr(message.data.x, message.data.y, message.data.color);
      winner.value = gameData.game.currentColor == 1 ? '黑棋' : '白棋';
      break;
    }
  }
}

onBeforeUnmount(() => {
  socket.close();
})
</script>

<style lang='less' scoped>
.game {
  width: 100%;
  height: calc(100% - 300px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.ready {
  button {
    border: none;
    padding: 10px 20px;
    margin: 0 20px;
    background-color: #fff;
    border-radius: 5px;
    font-size: 20px;

    &:hover {
      background-color: #cdcdcd;
    }
  }
}

.control {
  width: 100%;
  height: 300px;
  background: linear-gradient(to top, #ffefef, #efd8c8);
  position: fixed;
  bottom: 0;
  box-shadow: 0 0 40px #000000;

  .player {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;

    .p1,
    .p2 {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 50px;
      background-color: white;
      font-size: 20px;
      border-radius: 5px;
    }

    .score {
      display: flex;
      align-items: center;

      >div {
        width: 30px;
        height: 30px;
        padding: 0 10px;
      }

      .turned {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }

      .t1 {
        background-color: black;
      }

      .t2 {
        background-color: white;
      }
    }
  }

  .btn {
    width: 100%;
    height: 50%;
    display: flex;
    justify-content: space-around;
    margin-top: 20px;

    button {
      flex: 1 1 auto;
      height: 50%;
    }
  }
}

.message {
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  >p {
    font-size: 30px;
    font-weight: bold;
    color: #000000;
  }

  >button {
    width: 100px;
    height: 40px;
    margin-top: 10px;
    border-radius: 5px;
    font-size: 20px;
    font-weight: bold;
    background-color: #fffbfb;
    border: 1px solid #000000;
    color: #000000;

    &:hover {
      background-color: #cdcdcd;
      color: white;
    }
  }
}
</style>
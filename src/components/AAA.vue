<template>
    <div class='app'>
      <Chessboard @pieceClick="(x,y,who)=>judgeVictory(x,y,who)" :chessArr="chessArr"></Chessboard>
      <div v-show="winner" class="message">
        <p>恭喜{{winner}}获胜!</p>
        <button @click="reset">再来一局</button>
      </div>
      <div class='control'>
        <div class="player">
          <div class="p1">
            <input v-model="playerName[0]" type="text" name="" id="" placeholder="玩家一">
          </div>
          <div class="score">
            <div>
              <div class="turned" :class="{'t1':state==1,'t2':state==2}" v-show="sequence[0]==state"></div>
            </div>
            <h1>{{score[0]}}:{{score[1]}}</h1>
            <div>
              <div class="turned" :class="{'t1':state==1,'t2':state==2}" v-show="sequence[1]==state"></div>
            </div>
          </div>
          <div class="p2">
            <input v-model="playerName[1]" type="text" name="" id="" placeholder="玩家二">
          </div>
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
  import Chessboard from './components/Chessboard.vue'
  import { ref, reactive } from 'vue';
  const SIZE = 20;
  const chessArr = reactive(new Array(SIZE).fill(0).map(() => new Array(SIZE).fill(0)));
  const state = ref(1);
  const score = reactive(JSON.parse(localStorage.getItem('score')||'[0,0]'));
  const playerName = reactive(JSON.parse(localStorage.getItem('playerName')||'["",""]'));
  const sequence = reactive([1,2])
  const winner = ref('');
  const rules=[
    {x:0,y:1},
    {x:1,y:-1},
    {x:1,y:0},
    {x:1,y:1}
  ]
  const stepList=reactive([]);
  // 判断是否越界
  const boundary = (x,y)=>{
    if(x<0||x>=SIZE||y<0||y>=SIZE) return false;
    else return true;
  }
  
  // 保存比分
  const save = ()=>{
    localStorage.setItem('score',JSON.stringify(score));
    localStorage.setItem('playerName',JSON.stringify(playerName));
  }
  const clear = ()=>{
    localStorage.removeItem('score');
    localStorage.removeItem('playerName');
    score.fill(0);
  }
  
  // 判断是否获胜
  const judgeVictory = (x, y) => {
    chessArr[x][y] = state.value;
    stepList.push({x,y});
    // 判断是否有五子连线
    for(let i=0;i<rules.length;i++){
      let count=1;
      let xx=x;
      let yy=y;
      while(boundary(xx+rules[i].x,yy+rules[i].y)){
        xx+=rules[i].x;
        yy+=rules[i].y;
        if(chessArr[xx][yy]==state.value){
          count++;
        }
        else break;
      }
      xx = x;
      yy = y;
      while(boundary(xx-rules[i].x,yy-rules[i].y)){
        xx-=rules[i].x;
        yy-=rules[i].y;
        if(chessArr[xx][yy]==state.value){
          count++;
        }
        else break;
      }
      if(count>=5){
        winner.value=(state.value==1)?'黑棋':'白棋';
        let index = sequence.indexOf(state.value);
        score[index]++;
        save();
        return true;
      } 
    }
    state.value = (state.value==1)?2:1;
    return false;
  }
  // 重置棋盘
  const reset = () => {
    // 交换顺序
    let temp = sequence[0];
    sequence[0] = sequence[1];
    sequence[1] = temp;
    // 重置棋盘
    chessArr.forEach(row => row.fill(0));
    stepList.splice(0,stepList.length);
    state.value = 1;
    winner.value='';
  }
  
  // 悔棋
  const retract = ()=>{
    const {x,y} = stepList.pop();
    chessArr[x][y] = 0;
    state.value = (state.value==1)?2:1;
  }
  // 认输
  const giveUp =()=>{
    winner.value = (state.value==1)?'白棋':'黑棋';
    let index = sequence.indexOf(state.value);
    score[index==0?1:0]++;
    save();
  }
  </script>
  
  <style lang='less' scoped>
  .app {
    width: 100%;
    height: calc(100% - 300px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: antiquewhite;
  }
  
  .control {
    width: 100%;
    height: 300px;
    background:linear-gradient(to top, #ffefef, #efd8c8);
    position: fixed;
    bottom: 0;
    box-shadow: 0 0 40px #000000;
    .player{
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      input{
        border: none;
        width: 100%;
        height: 50px;
        outline: none;
        font-size: 20px;
        border-radius: 5px;
        &::placeholder{
          font-size: 20px;
        }
      }
      .score{
        display: flex;
        align-items: center;
        >div{
          width: 30px;
          height: 30px;
          padding: 0 10px;
        }
        .turned{
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .t1{
           background-color: black;
        }
        .t2{
           background-color: white;
        }
      }
    }
    .btn{
      width: 100%;
      height: 50%;
      display: flex;
      justify-content: space-around;
      margin-top: 20px;
      button{
        flex:1 1 auto;
        height: 50%;
      }
    }
  }
  .message{
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    >p{
      font-size: 30px;
      font-weight: bold;
      color: #000000;
    }
    >button{
      width: 100px;
      height: 40px;
      margin-top: 10px;
      border-radius: 5px;
      font-size: 20px;
      font-weight: bold;
      background-color: #fffbfb;
      border: 1px solid #000000;
      color: #000000;
      &:hover{
        background-color: #cdcdcd;
        color: white;
      }
    }
  }
  </style>
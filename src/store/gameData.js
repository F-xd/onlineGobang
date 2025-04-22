import {defineStore} from 'pinia'
export const useGameData = defineStore(
    'GameData',
    {
        //状态管理
        state:()=>({
            playerInfo:{
                name:'',
                desc:'',
                clientInfo:''
            },
            roomCode:'',
            game:[],
            chessArr:new Array(20).fill(0).map(() => new Array(20).fill(0))
        }),
        //修改状态的方法
        actions:{
            setPlayerInfo(info){
                this.playerInfo = info;
            },
            clearPlayerInfo(){
                this.playerInfo = {
                    name:'',
                    desc:'',
                    clientInfo:''
                }
            },
            setRoomCode(code){
                this.roomCode = code;
            },
            clearRoomCode(){
                this.roomCode = '';
            },
            setGame(game){
                this.game = game;
            },
            setChessArr(x,y,val){
                this.chessArr[x][y] = val;
            }
        },
        //持久化存储
        persist:true
    }
)
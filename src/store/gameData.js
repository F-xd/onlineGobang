import {defineStore} from 'pinia'
export const useGameData = defineStore(
    'GameData',
    {
        //状态管理
        state:()=>({
            playerInfo:{
                name:'',
                desc:'',
            }
        }),
        //修改状态的方法
        actions:{
            setPlayerInfo(info){
                Object.assign(this.playerInfo,info)
            }
        },
        //持久化存储
        persist:true
    }
)
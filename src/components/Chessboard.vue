<template>
    <div class='chessboard' ref='chessboard'>
        <div class="chess-row" v-for="(item, index) in chessArr" :key="index">
            <div class="chess-item" v-for="(item2, index2) in item">
                <div @click="handlePieceClick(index, index2)" class="pieces" :class="{'pieces1':item2===1,'pieces2':item2===2}"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
const chessboard = ref();
const props = defineProps({
    chessArr: {
        type: Array,
        default: () => []
    },
    state:{
        type:Number,
        default:1
    }
});
const emit = defineEmits(['pieceClick']);
const handlePieceClick = (x,y)=>{
    if(props.chessArr[x][y]!=0) return;
    emit('pieceClick',x,y);
}
const setChessboardSize = () => {
    const x = window.innerWidth;
    const y = window.innerHeight - 300;
    const min = Math.min(x, y);
    chessboard.value.style.width = `${min}px`;
    chessboard.value.style.height = `${min}px`;
    chessboard.value.style.paddingLeft = document.querySelector('.chess-item').clientWidth+'px';
    chessboard.value.style.paddingTop = document.querySelector('.chess-item').clientWidth+'px';
    chessboard.value.style.paddingLeft = document.querySelector('.chess-item').clientWidth+'px';
    chessboard.value.style.paddingTop = document.querySelector('.chess-item').clientWidth+'px';
}
onMounted(()=>{
    setChessboardSize();
})
window.addEventListener('resize', setChessboardSize);
</script>

<style lang='less' scoped>
.chessboard {
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    border: 3px solid rgb(163, 100, 12);
}

.chess-row {
    width: 100%;
    height: 100%;
    display: flex;
    .chess-item {
        box-sizing: border-box;
        position: relative;
        width: 100%;
        height: 100%;
        border-top: 1px solid #000000;
        border-left: 1px solid #000000;
        &:last-child{
            border-top: none;
        }
    }
    &:last-child >.chess-item {
        border-left: none;
    }
}
.pieces{
    position: absolute;
    bottom: 50%;
    right: 50%;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
}
.pieces1{
    background-color: rgb(0, 0, 0);
    border-radius: 50%;
    box-shadow: inset 0 0 2px rgb(255, 255, 255, 0.5);
}
.pieces2{
    background-color: rgb(255, 255, 255);
    border-radius: 50%;
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.5);
}
</style>
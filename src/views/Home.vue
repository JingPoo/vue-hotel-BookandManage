<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import axios from 'axios'
import SearchRoom from '../components/SearchRoom.vue'
import { useStore } from 'vuex'

const store = useStore()
const today = ref(new Date().toISOString().split('T')[0])
const checkin_date = ref(today)
const checkout_date = ref(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0])
const discount = ref(store.state.discount)
const service_fee = ref(store.state.serviceFee)

const adult = ref(2)
const children = ref(0)
const roomAmount = ref(1)
const adultOptions = ref([1,2,3,4])
const childOptions = ref([0,1,2,3,4])
const roomOptions = ref([1,2])
const rooms = ref([])
const totalRooms = ref(0)
const nowShow = ref(0)
const searchedRooms = ref([])
const comfirmRooms = ref([])
const totalMoney = ref(0)
const nightCount = ref(0) // 根據房間容納人數計算到第幾晚
const resultNight = ref(1) // 訂房區顯示
const finishLoad = ref(false)
const closeCurtain = ref(false)
const scrollhint = ref(false)

onMounted(()=>{
    axios.get('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms')
    .then((res)=>{
        rooms.value = res.data
        totalRooms.value = res.data.length
        finishLoad.value = true
        setTimeout(()=>{
            closeCurtain.value = true
        }, 1500)
    }).catch((err)=>{
        console.log(err)
    })
    window.addEventListener('mouseup', mouseupHandler)
    window.addEventListener('mousemove', mousemoveHandler)
})
onUnmounted(() => {
    window.removeEventListener('mouseup', mouseupHandler)
    window.removeEventListener('mousemove', mousemoveHandler)
})
const checkinHandler = (()=>{
    let checkoutDate = new Date(checkin_date.value)
    checkoutDate = checkoutDate.setDate(checkoutDate.getDate() + 1)
    checkoutDate = new Date(checkoutDate).toISOString().split('T')[0]
    checkout_date.value = checkoutDate
})

const checkout_date_min = ((checkin_date)=>{
    let min = new Date(checkin_date)
    min = min.setDate(min.getDate() + 1)
    min = new Date(min).toISOString().split('T')[0]
    return min
})

const nightStay = computed(()=>{
    let difference = new Date(checkout_date.value) - new Date(checkin_date.value)
    return difference / (1000 * 3600 * 24)
})

// 看人數決定客房數選項
watch([adult, children], ([newAdult, newChildern])=>{
    let totalPeople = newAdult + newChildern
    roomOptions.value = Array.from({ length: totalPeople }, (value, index) => index+1)
})

const searchHandler = ((e)=>{
    comfirmRooms.value = []
    nightCount.value = 0
    totalMoney.value = 0
    resultNight.value = 1
    scrollhint.value = true

    let people = adult.value + children.value
    let room_amount = roomAmount.value

    if(people / room_amount > 4) alert('沒有四人以上房間，請重新選擇')
    else if(people == room_amount){
        searchedRooms.value = rooms.value.filter(room => room.size == 1)
    }
    else if(room_amount > 1){
        // 給選擇
        searchedRooms.value = rooms.value.filter(room => room.size < people)
    }
    else searchedRooms.value = rooms.value.filter(room => room.size == people/room_amount)
})

const roomClickHandler = ((room)=>{
    if(store.state.user) {
        let finalPrice = parseInt(room.price * discount.value * room.discount + service_fee.value)
        let totalPeople = adult.value + children.value

        let nightCountAdd = parseFloat((room.size/totalPeople).toFixed(2))
        nightCount.value += nightCountAdd

        let nightCountDecimal = nightCount.value.toString().split('.')[1]
        if(nightCountDecimal && nightCountDecimal[0] == 9) nightCount.value = Math.ceil(nightCount.value)
        // 依照所選房型大小計算共可以選房 && 每晚住房數不能超過所選
        if(nightCount.value > nightStay.value || comfirmRooms.value.length > nightStay.value*roomAmount.value){
            nightCount.value -= nightCountAdd
            return
        }   
        let d = new Date(checkin_date.value)
        d = d.setDate(d.getDate() + resultNight.value)
        d = new Date(d).toISOString().split('T')[0]
        comfirmRooms.value.push({
            id: room.id,
            name: room.name,
            eng: room.eng,
            equip: room.equipment,
            cover: room.cover,
            date: d,
            final_price: finalPrice
        })
        totalMoney.value += parseInt(finalPrice)
        if(resultNight.value <= nightCount.value && nightCount.value < nightStay.value) resultNight.value ++
    } else {
        alert('請先登入會員')
    }
    
})
const deleteRoomHandler = ((index)=>{
    let totalPeople = adult.value + children.value
    nightCount.value -= parseFloat((comfirmRooms.value[index].size/totalPeople).toFixed(2))
    totalMoney.value -= comfirmRooms.value[index].final_price
    comfirmRooms.value.splice(index, 1)
    if( (resultNight.value - 1)  === Math.ceil(nightCount.value) && resultNight.value > 1) resultNight.value --
})
const comfirmHandler = (()=>{
    localStorage.setItem(store.state.user['uid'], JSON.stringify(comfirmRooms.value))
    searchedRooms.value = []
    comfirmRooms.value = []
    resultNight.value = 1
    scrollhint.value = false
    alert('訂房已確認! 歡迎您入住')
})
const cancelHandler = (()=>{
    comfirmRooms.value = []
    resultNight.value = 1
    nightCount.value = 0
    totalMoney.value = 0
})

let timer = setInterval(function(){
    nextHandler()
}, 3000)
const resetTimer = (()=>{
    clearInterval(timer)
    timer = setInterval(function(){
        nextHandler()
    }, 3000)
})
const previousHandler = (()=>{
    nowShow.value = (nowShow.value - 1 + totalRooms.value) % totalRooms.value
    translate.value = 0
    resetTimer()
})
const nextHandler = (()=>{
    nowShow.value = (nowShow.value + 1 + totalRooms.value) % totalRooms.value
    translate.value = 0
    resetTimer()
})
const dotHandler = ((index)=>{
    nowShow.value = index-1
    resetTimer()
})

const dragging = ref(false)
const startX = ref(null)
const translate = ref(0)

const mousedownHandler = (e) => {
    dragging.value = true
    startX.value = e.pageX
}
const mouseupHandler = () => {
    dragging.value = false
    if(translate.value > 0) previousHandler()
    else if(translate.value < 0) nextHandler()
}
const mousemoveHandler = (e) => {
    if(!dragging.value) return
    e.preventDefault()
    translate.value = (e.pageX  - startX.value)
}
const dragImg = computed(() => {
    return {
        transform: `translateX(${translate.value}px)`,
    }
})
</script>
<template>
    <div>
        <Teleport to="body">
            <div class="curtain" :class="{close: closeCurtain}">
                <div class="curtainTop" :class="{done: finishLoad}">
                    <h1>Jing Hotel</h1>
                </div>
                <div class="curtainBot" :class="{done: finishLoad}"></div>
            </div>
        </Teleport>
        <div class="container" :class="{show: finishLoad}" v-if="rooms.length">
            <div class="slideshow" @mousedown="mousedownHandler" >
                <div class="slider" :style="dragImg">
                    <div class="slide" 
                    v-for="(room, index) in rooms" :key="index" :class="[{show: nowShow === index},{showLeft: (nowShow - 1 + totalRooms) % totalRooms === index},{showRight: (nowShow + 1 + totalRooms) % totalRooms === index}]">
                        <img :src="room.cover">
                        <div class="text"> {{ room.name }} </div>
                    </div>
                </div>
                <a class="previous" @click="previousHandler"><i class="fa-solid fa-chevron-left"></i></a>
                <a class="next" @click="nextHandler"><i class="fa-solid fa-chevron-right"></i></a>
                <div class="dots">
                    <span class="dot" v-for="index in totalRooms" :key="index" @click="dotHandler(index)" :class="{now: nowShow === index-1}"></span>
                </div>
            </div>
            <div class="quickBook">
                <h1>快速訂房</h1>
                <div class="book_block">
                    <div class="date">
                        <label for="checkin_date">入住日期</label>
                        <input type="date" id="checkin_date" :min="today" v-model="checkin_date" @input="checkinHandler" required>
                        <label for="checkout_date">退房日期</label>
                        <input type="date" id="checkout_date" :min="checkout_date_min(checkin_date)" v-model="checkout_date" required>
                        <span> ({{ nightStay }}晚) </span>
                    </div>
                    <div class="room_detail">
                        <label for="adult-select">成人</label>  
                        <select name="adult" id="adult-select" v-model="adult">
                            <option v-for="index in adultOptions" :key="index" :value="index">{{index}}</option>
                        </select>
                        <label for="children-select">小孩</label>  
                        <select name="children" id="children-select" v-model="children">
                            <option v-for="index in childOptions" :key="index" :value="index">{{index}}</option>
                        </select>
                        <label for="roomAmount-select">客房</label>  
                        <select name="roomAmount" id="roomAmount-select" v-model="roomAmount">
                            <option v-for="index in roomOptions" :key="index" :value="index">{{index}}</option>
                        </select>
                    </div>
                    <button id="search-room" @click="searchHandler">搜尋</button>
                </div>
                <div class="scrollhint" v-show="scrollhint===true">
                    <span>scroll</span>
                    <i class="fa-solid fa-angles-down fa-bounce"></i>
                </div>
            </div>
            <transition name="comfirmbox">
                <div class="comfirm" v-if="comfirmRooms.length">
                    <div class="info">
                        <h3>確認入住資訊:</h3>
                        <div class="comfirmRoom" v-for="(room, index) in comfirmRooms" :key="index">
                            <span>{{ room.name }} ${{ room.final_price }} ({{ room.date }})</span>
                            <!-- <i class="fa-solid fa-trash-can" @click="deleteRoomHandler(index)"></i> -->
                        </div>
                        <h4>= ${{ totalMoney }}</h4>
                    </div>
                    <div class="button">
                        <button class="btn-green" @click="comfirmHandler">確認</button>
                        <button class="btn-red" @click="cancelHandler">取消</button>
                    </div>
                </div>
            </transition>
            <div class="result" v-if="searchedRooms.length">
                <h2>請選擇您第 {{ resultNight }} 晚的住宿</h2>
                <SearchRoom 
                    v-for="room in searchedRooms" 
                    :key="room.id"
                    :roomData="room" 
                    :hotelDiscount="discount"
                    :hotelFee="service_fee"
                    @click="roomClickHandler(room)"
                    >
                </SearchRoom>
            </div>
        </div>
        <div class="loading" v-else>
            Loading...
        </div>
    </div>
</template>
<style scoped lang="scss">
@import "../assets/style.scss";

* {
    padding: 0;
    margin: 0;
    text-decoration: none;
    outline: none;
}
.curtain {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;

    &.close {
        display: none;
    }
    .curtainTop,
    .curtainBot {
        position: fixed;
        left: 0;
        width: 100vw;
        height: 50vh;
        background-color: white;
        transition: all 1.5s;
    }
    .curtainTop {
        top: 0;
        display: flex;
        justify-content: center;
        align-items: flex-end;

        &.done {
            transform: translateY(-100%);
        }
        h1 {
            color: $primary;
            padding-bottom: 10px;
        }
    }
    .curtainBot {
        bottom: 0;
        &.done {
            transform: translateY(100%);
        }
    }
}
.container {
    width: 100%;  
    padding-top: 2rem;    
    display: flex;
    flex-direction: column;
    align-items: center;  
    overflow: hidden;

    .slideshow {
        width: 95vw;
        height: 25rem;
        position: relative;
        margin-bottom: 2.6rem;

        @include md {
            width: 40rem;
            height: 28rem;
        }
        @include lg {
            width: 48rem;
            height: 30rem;
        }
        @include xl {
            width: 58em;
            height: 34rem;
        }
        a {
            font-size: 3rem;
            color: gray;
            position: absolute;
            cursor: pointer;
            transition: .3s;
            display: none;

            @include md {
                top: 40%
            }
            @include xl {
                top: 45%;
            }
            &:hover{
                color: $primary;
            }
        }
        .previous {
            display: none;

            @include md {
                display: block;
                left: -40px;
                z-index: 20;
            }
            
            &:hover{ 
                transform: translateX(-5px);
            }
        }
        .next {
            display: none;

            @include md {
                display: block;
                right: -40px;
                z-index: 20;
            }

            &:hover{ 
                transform: translateX(5px);
            }
        }
        .dots {
            width: max-content;
            position: absolute;
            top: calc(100% + 15px);
            left: 24%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 20;

            @include sm {
                left: 30%;
            }
            @include xl {
                left: 35%;
            }
            .dot{
                cursor: pointer;
                height: 1rem;
                width: 1rem;
                margin: 0px 4px;
                border-radius: 50%;
                background-color: transparent;
                border: 1px solid #4e4c4c;

                &:hover,
                &.now {
                    background-color: #4e4c4c;
                }
            }
        }
        .slider {
            width: 100%;
            height: 100%;

            .slide {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                opacity: 0;
                
                img {
                    width: 100%;
                    height: 100%;
                }
                .text {
                    position: absolute;
                    bottom: 1rem;
                    right: 1rem;
                    padding: .5rem 1rem;
                    border-radius: 16px;
                    background-color: rgba(0,0,0,.5);
                    color: white;
                    font-size: 20px;
                }
                &.show {
                    opacity: 1;
                    z-index: 10;
                    box-shadow: 0px 0px 10px gray;
                    animation: center 3s linear;
                }
                &.showLeft,
                &.showRight {
                    opacity: .7;
                    position: absolute;

                    .text {
                        display: none;
                    }
                }
                &.showLeft {
                    left: -100%;
                    animation: left 3s linear;
                }
                &.showRight {
                    left: 100%;
                    animation: right 3s linear;
                }
            }

        }
        
    }
    .quickBook {
        width: 80%;
        height: 22rem;
        background-color: rgba(129, 123, 71, 0.377);
        border-radius: 20px;
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        @include md {
            height: 14rem;
        }
        h1{
            height: 3rem;
        }
        .scrollhint {
            font-size: 1.4rem;
            position: absolute;
            z-index: 20;
            bottom: 10px;
            right: 10px;
        }
        .book_block {
            width: 100%;
            height: calc(100% - 3rem);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            font-size: 1.2rem;

            @include md {
                font-size: 1.4rem;
            }
            .date {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;

                @include md {
                    flex-direction: row;
                }
                input{
                    font-size: 18px;
                }
            }
            .room_detail{
                display: flex;

                label{
                    margin: 0px 5px;
                }
                select{
                    width: 40px;
                    font-size: 20px;
                    border: none;
                    border-radius: 5px;
                }
            }
            button#search-room{
                height: 2.4rem;
                width: 4rem;
                line-height: 30px;
                font-size: 1.2rem;
                font-weight: bold;
                border: none;
                border-radius: 10px;
                padding: 2px 5px;
                margin-top: .2rem;
                color: white;
                background-color: #326997;
                cursor: pointer;

                @include md {
                    margin-top: 0;
                }
                &:hover{
                    background-color: #21435f;
                }
            }
        }
    }
    .comfirm{
        width: 100vw;
        height: max-content;
        background-color: $secondary;
        padding: 1rem 2rem;
        position: fixed;
        top: 60px;
        z-index: 90;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        border-top: 2px solid $primary;
        border-bottom: 2px solid $primary;

        .info {
            width: 100%;
            height: max-content;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            align-items: center;
            gap: 20px;

            h4{
                font-size: 20px;
                font-weight: normal;
            }
        }
       
        .button {
            display: flex;
            gap: 1rem;

            button{
                font-size: 1.2rem;
                font-weight: bold;
            }
        }
        
        .comfirmRoom{
            background-color: rgb(206, 234, 237);
            border-radius: 5px;
            padding: 10px;
            position: relative;

            i{
                padding-left: 10px;
                cursor: pointer;

                &:hover{
                    color: rgb(193, 108, 108);
                }
            }
        }
        .comfirmRoom +.comfirmRoom::before{
            content: '+';
            position: absolute;
            left: -14px;
        }
    }
    .result{
        width: 80%;
        display: flex;
        flex-direction: column;
        padding-top: 1rem;
        gap: 1rem;

        @include lg {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
        }
        h2 {
            grid-column: 1/3;
            text-align: center;
        }
    }
}
.loading {
    text-align: center;
    margin-top: 3rem;
}
.comfirmbox-enter-active {
    animation: tvin .3s ease;
}
.comfirmbox-leave-active {
    animation: tvout .3s ease;
}
@keyframes center{
    0%{
        transform: translateX(10%);
        opacity: .7;
    }
    10%{
        transform: translateX(0);
        opacity: 1;
    }
    90%{
        transform: translateX(0);
        opacity: 1;
    }
    100%{
        transform: translateX(-10%);
        opacity: .7;
    }
}
@keyframes left{
    0%{
        transform: scale(.9);
    }
    10%{
        transform: scale(.8);
    }
    100%{
        transform: scale(.8);
    }
}
@keyframes right{
    0%{
        transform: scale(.8);
    }
    90%{
        transform: scale(.8);
    }
    100%{
        transform: scale(.9);
    }
}
@keyframes tvin {
    0%{
        opacity: 0;
        transform: scale(.5);
    }
    100%{
        opacity: 1;
        transform: scale(1);
    }
}
@keyframes tvout {
    0%{
        opacity: 1;
        transform: scale(1);
    }
    100%{
        opacity: 0;
        transform: scale(.5);
    }
}
</style>
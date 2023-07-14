<script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import axios from 'axios';
    import SearchRoom from '../components/SearchRoom.vue'
    import RoomModal from '../components/RoomModal.vue'

    const today = ref(new Date().toISOString().split('T')[0])
    const checkin_date = ref(today)
    const checkout_date = ref(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0])
    const discount = ref(0.9) // 飯店折扣
    const service_fee = ref(200) // 服務費

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
    const nightCount = ref(0)
    const showModal = ref(-1)

    onMounted(()=>{
        axios.get('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms')
        .then((res)=>{
            rooms.value = res.data
            totalRooms.value = res.data.length
        }).catch((err)=>{
            console.log(err)
        })
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
    const searchHandler = (()=>{
        comfirmRooms.value = []
        nightCount.value = 0
        totalMoney.value = 0

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
        let finalPrice = parseInt(room.price * discount.value * room.discount + service_fee.value)
        let totalPeople = adult.value + children.value
        
        nightCount.value += parseFloat((room.size/totalPeople).toFixed(2))
        // console.log(nightCount.value, nightStay.value, comfirmRooms.value.length, nightStay.value*roomAmount.value)
        // 依照所選房型大小計算共可以選房 && 每晚住房數不能超過所選
        if(nightCount.value > nightStay.value || comfirmRooms.value.length > nightStay.value*roomAmount.value){
            nightCount.value -= parseFloat((room.size/totalPeople).toFixed(2))
            return
        }   
        // if(comfirmRooms.value.length >= nightStay.value) return
        comfirmRooms.value.push({
            name: room.name,
            size: room.size,
            final_price: finalPrice
        })
        // console.log(nightCount.value)
        totalMoney.value += parseInt(finalPrice)
    })
    const deleteRoomHandler = ((index)=>{
        let totalPeople = adult.value + children.value
        nightCount.value -= parseFloat((comfirmRooms.value[index].size/totalPeople).toFixed(2))
        totalMoney.value -= comfirmRooms.value[index].final_price
        comfirmRooms.value.splice(index, 1)
    })
    const comfirmHandler = (()=>{
        alert('訂房已確認! 歡迎您入住')
        searchedRooms.value = []
        comfirmRooms.value = []
    })
    const cancelHandler = (()=>{
        searchedRooms.value = []
        comfirmRooms.value = []
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
        resetTimer()
    })
    const nextHandler = (()=>{
        nowShow.value = (nowShow.value + 1 + totalRooms.value) % totalRooms.value
        resetTimer()
    })
    const dotHandler = ((index)=>{
        nowShow.value = index-1
        resetTimer()
    })
    const slideClickHandler = ((index)=>{
        showModal.value = index
    })
    const closeModalHandler = (()=>{
        showModal.value = -1
    })
</script>
<template>
    <div class="container">
        <div class="slideshow">
            <div class="slide" 
            v-for="(room, index) in rooms" :key="index" :class="[{show: nowShow === index},{showLeft: (nowShow - 1 + totalRooms) % totalRooms === index},{showRight: (nowShow + 1 + totalRooms) % totalRooms === index}]"
            @click="slideClickHandler(index)">
                <img :src="room.cover">
                <div class="text"> {{ room.name }} </div>
            </div>
            <a class="previous" @click="previousHandler"><i class="fa-solid fa-chevron-left"></i></a>
            <a class="next" @click="nextHandler"><i class="fa-solid fa-chevron-right"></i></a>
            <div class="dots">
                <span class="dot" v-for="index in totalRooms" :key="index" @click="dotHandler(index)" :class="{now: nowShow === index-1}"></span>
            </div>
            <Teleport to="body">
                <RoomModal 
                    v-for="(room, index) in rooms" 
                    :key="room.id"
                    v-show="showModal == index"
                    :room="room"
                    :hotelDiscount="discount"
                    :hotelFee="service_fee"
                    @close="closeModalHandler">
                </RoomModal>
            </Teleport>
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
        </div>
        <transition name="comfirmbox">
            <div class="comfirm bg-info-light-2" v-if="comfirmRooms.length">
                <h3>確認入住資訊:</h3>
                <div class="comfirmRoom" v-for="(room,index) in comfirmRooms" :key="index">
                    <span>{{ room.name }} ${{ room.final_price }}</span>
                    <i class="fa-solid fa-trash-can" @click="deleteRoomHandler(index)"></i>
                </div>
                <h4>= ${{ totalMoney }}</h4>
                <button class="btn-green" @click="comfirmHandler">確認</button>
                <button class="btn-red" @click="cancelHandler">取消</button>
            </div>
        </transition>
        <div class="result">
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
</template>
<style scoped lang="scss">
@import "../assets/style.scss";

* {
    padding: 0;
    margin: 0;
    text-decoration: none;
    outline: none;
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

        @include md {
            width: 40rem;
            height: 28rem;
        }
        @include xl {
            width: 54rem;
            height: 36rem;
        }
        a {
            font-size: 3rem;
            color: gray;
            position: absolute;
            top: 40%;
            cursor: pointer;
            transition: .3s;

            @include md {
                top:35%
            }
            @include xl {
                top: 40%;
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
            width: 100%;
            height: 4rem;
            position: absolute;
            bottom: 0;
            display: flex;
            justify-content: center;
            align-items: center;

            .dot{
                cursor: pointer;
                height: 1rem;
                width: 1rem;
                margin: 0px 4px;
                border-radius: 50%;
                background-color: #bbb;

                @include md {
                    height: 0.8rem;
                    width: 0.8rem;
                }
                &:hover,
                &.now {
                    background-color: #4e4c4c;
                }
            }
        }
        .slide {
            width: 100%;
            height: calc(100% - 4rem);
            position: absolute;
            top: 0;
            left: 0;
            opacity: 0;
            cursor: pointer;
            
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
    .quickBook {
        width: 80%;
        height: 22rem;
        background-color: rgba(129, 123, 71, 0.377);
        backdrop-filter: blur(2px);
        border-radius: 20px;
        padding: 1rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;

        @include md {
            height: 14rem;
        }
        h1{
            height: 3rem;
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
                gap: 1.2rem;
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
        padding: 1rem 2rem;
        position: fixed;
        top: 4rem;
        z-index: 90;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 20px;
        padding-bottom: 10px;
        border-bottom: 2px solid rgb(15, 15, 43);

        h4{
            font-size: 20px;
            font-weight: normal;
        }
        button{
            font-size: 1.2rem;
            font-weight: bold;
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
    }
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
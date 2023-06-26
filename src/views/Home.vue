<script setup>
    import { ref, computed, onMounted, watch } from 'vue';
    import axios from 'axios';
    import SearchRoom from '../components/SearchRoom.vue'

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
    const searchedRooms = ref([])
    const comfirmRooms = ref([])
    const totalMoney = ref(0)
    const nightCount = ref(0)

    onMounted(()=>{
        axios.get('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms')
        .then((res)=>{
            rooms.value = res.data
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
        return new Date(checkout_date.value).getDate() - new Date(checkin_date.value).getDate()
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
</script>
<template>
    <div class="container">
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
        <div class="comfirm" v-if="comfirmRooms.length">
            <h3>確認入住資訊:</h3>
            <div class="comfirmRoom" v-for="(room,index) in comfirmRooms" :key="index">
                <span>{{ room.name }} ${{ room.final_price }}</span>
                <i class="fa-solid fa-trash-can" @click="deleteRoomHandler(index)"></i>
            </div>
            <h4>= ${{ totalMoney }}</h4>
            <button @click="comfirmHandler">確認</button>
        </div>
        <div class="result">
            <SearchRoom 
                v-for="(room, index) in searchedRooms" 
                :key="room.id"
                :room_data="room" 
                :hotel_discount="discount"
                :hotel_fee="service_fee"
                :index="index"
                @click="roomClickHandler(room)"
                >
            </SearchRoom>
        </div>
    </div>
</template>
<style scoped>
    *{
        padding: 0;
        margin: 0;
        text-decoration: none;
        outline: none;
    }
    .container{
        width: 100%;  
        padding: 10px 20px;    
        display: flex;
        flex-direction: column;
        align-items: center;  
    }
    .quickBook{
        width: 100%;
        height: 150px;
        background-color: rgba(129, 123, 71, 0.377);
        backdrop-filter: blur(2px);
        border-radius: 10px;
        padding: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    .quickBook h1{
        height: 50px;
    }
    .book_block{
        width: 100%;
        flex-grow: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        gap: 15px;
    }
    .book_block .date{
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .book_block input{
        font-size: 16px;
    }
    .room_detail{
        display: flex;
    }
    .room_detail > label{
        margin: 0px 5px;
    }
    .room_detail select{
        width: 40px;
        font-size: 20px;
        border: none;
        border-radius: 5px;
    }
    button#search-room{
        height: 30px;
        width: 60px;
        line-height: 30px;
        margin-left: 20px;
        font-size: 16px;
        border: none;
        border-radius: 10px;
        padding: 2px 5px;
        color: white;
        background-color: #326997;
        cursor: pointer;
    }
    button#search-room:hover{
        background-color: #21435f;
    }
    .comfirm{
        width: 100%;
        padding-top: 10px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 20px;
        padding-bottom: 10px;
    }
    .comfirm h4{
        font-size: 20px;
        font-weight: normal;
    }
    .comfirm button{
        padding: 5px 10px;
        color: white;
        background-color: rgb(184, 92, 92);
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        font-weight: bold;
    }
    .comfirm button:hover{
        background-color: rgb(116, 58, 58);
    }
    .comfirmRoom{
        background-color: rgb(199, 197, 188);
        border-radius: 5px;
        padding: 10px;
        position: relative;
    }
    .comfirmRoom +.comfirmRoom::before{
        content: '+';
        position: absolute;
        left: -14px;
    }
    .comfirmRoom i{
        padding-left: 10px;
        cursor: pointer;
    }
    .comfirmRoom i:hover{
        color: rgb(193, 108, 108);
    }
    .result{
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding-top: 20px;
        gap: 30px 20px;
    }

    /* For Mobile Device */
    @media all and (max-width: 414px){
        .quickBook{
            height: 260px;
        }
        .quickBook h1{
            font-size: 26px;
        }
        .book_block{
            font-size: 14px;
            gap: 5px;
            display: flex;
            flex-direction: column;
        }
        .book_block .date{
            flex-direction: column;
            gap: 2px;
        }
        .date span{
            font-size: 12px;
        }
        .book_block input{
            width: 92px;
            font-size: 12px;
        }
        .room_detail select{
            width: 30px;
            font-size: 12px;
        }
        button#search-room{
            margin-top: 10px;
            margin-left: 0;
            font-size: 14px;
        }
        .result{
            display: flex;
            flex-direction: column;
        }
        .comfirm h3{
            font-size: 14px;
        }
        .comfirm span{
            font-size: 12px;
        }
        .comfirm h4{
            font-size: 14px;
        }
    }

    /* For Small Device */
    @media all and (min-width: 414px) and (max-width: 768px){
        .quickBook{
            height: 180px;
        }
        .quickBook h1{
            font-size: 26px;
        }
        .book_block{
            font-size: 14px;
            gap: 5px;
            display: flex;
            flex-direction: column;
        }
        .book_block .date{
            gap: 2px;
        }
        .date span{
            font-size: 12px;
        }
        .book_block input{
            width: 92px;
            font-size: 12px;
        }
        .room_detail select{
            width: 30px;
            font-size: 12px;
        }
        button#search-room{
            margin-top: 10px;
            margin-left: 0;
            font-size: 14px;
        }
        .comfirm h3{
            font-size: 14px;
        }
        .comfirm span{
            font-size: 12px;
        }
        .comfirm h4{
            font-size: 14px;
        }
    }

    /* For Medium Device */  
    @media all and (min-width: 768px) and (max-width: 992px){
        .quickBook h1{
            font-size: 30px;
        }
        .book_block{
            font-size: 14px;
            gap: 5px;
        }
        .book_block input{
            font-size: 12px;
        }
        .room_detail select{
            width: 30px;
            font-size: 12px;
        }
        button#search-room{
            height: 30px;
            width: 60px;
            line-height: 30px;
            margin-left: 20px;
            font-size: 14px;
            border: none;
            border-radius: 10px;
            padding: 2px 5px;
            color: white;
            background-color: #326997;
            cursor: pointer;
        }
        .comfirm h3{
            font-size: 16px;
        }
        .comfirm span{
            font-size: 14px;
        }
        .comfirm h4{
            font-size: 16px;
        }
    }
</style>
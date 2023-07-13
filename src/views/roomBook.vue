<script setup>
  import { ref, computed, onMounted } from 'vue'
  import Room from '../components/Room.vue'
  import RoomModal from '../components/RoomModal.vue'
  import axios from 'axios';

  const rooms = ref([])
  const discount = ref(0.9) // 飯店折扣
  const service_fee = ref(200) // 服務費
  const id = ref(rooms.value.length)
  const singleFiltered = ref(false)
  const doubleFiltered = ref(false)
  const tripleFiltered = ref(false)
  const quadrupleFiltered = ref(false)
  const sortBy = ref('unsort')
  const sortOptions = ref([
    {text: '不排序', value: 'unsort'},
    {text: '由低至高', value: 'ascend'},
    {text: '由高至低', value: 'descend'},
    {text: '最多折扣', value: 'mostDiscount'}
  ])
  const showModal = ref(-1)

  onMounted(()=>{
    axios.get('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms')
      .then((res)=>{
        rooms.value = res.data
      }).catch((err)=>{
        console.log(err)
      })
  })
  
  const filteredRooms = computed(()=>{
    return singleFiltered.value ? rooms.value.filter(room => room.size == 1) : 
            doubleFiltered.value ? rooms.value.filter(room => room.size == 2) :
            tripleFiltered.value ? rooms.value.filter(room => room.size == 3) :
            quadrupleFiltered.value ? rooms.value.filter(room => room.size == 4) : 
            rooms.value

  })

  const sortedFilteredRooms = computed(()=>{
    if(sortBy.value == "ascend"){
      return filteredRooms.value.sort((aRoom, bRoom) => 
      (aRoom.price * discount.value * aRoom.discount + service_fee.value) - 
      (bRoom.price* discount.value * bRoom.discount + service_fee.value))
    }
    else if(sortBy.value == "descend"){
      return filteredRooms.value.sort((aRoom, bRoom) => 
      (bRoom.price * discount.value * bRoom.discount + service_fee.value) - 
      (aRoom.price* discount.value * aRoom.discount + service_fee.value))
    }
    else if(sortBy.value == "mostDiscount"){
      return filteredRooms.value.sort((aRoom, bRoom) => 
      (aRoom.discount * discount.value) - (bRoom.discount * discount.value))
    }
    else return filteredRooms.value
  })

  const singleFilter = (()=>{
    singleFiltered.value = !singleFiltered.value
    doubleFiltered.value = false
    tripleFiltered.value = false
    quadrupleFiltered.value = false
  })
  const doubleFilter = (()=>{
    doubleFiltered.value = !doubleFiltered.value
    singleFiltered.value = false
    tripleFiltered.value = false
    quadrupleFiltered.value = false
  })
  const tripleFilter = (()=>{
    tripleFiltered.value = !tripleFiltered.value
    singleFiltered.value = false
    doubleFiltered.value = false
    quadrupleFiltered.value = false
  })
  const quadrupleFilter = (()=>{
    quadrupleFiltered.value = !quadrupleFiltered.value
    singleFiltered.value = false
    tripleFiltered.value = false
    doubleFiltered.value = false
  })

  const roomClickHandler = ((index)=>{
    showModal.value = index
  })
</script>

<template>
  <div class="container">
    <div class="roomList">
      <div class="title">
        <h1>房間列表 <span>({{ filteredRooms.length }}間)</span></h1>
        <div class="button">
          <div class="filter">
            <div class="single-filter" :class="{filtering: singleFiltered}" @click="singleFilter"><i class="fa-solid fa-tag"></i>單人房</div>
            <div class="double-filter" :class="{filtering: doubleFiltered}" @click="doubleFilter"><i class="fa-solid fa-tag"></i>雙人房</div>
            <div class="triple-filter" :class="{filtering: tripleFiltered}" @click="tripleFilter"><i class="fa-solid fa-tag"></i>三人房</div>
            <div class="quadruple-filter" :class="{filtering: quadrupleFiltered}" @click="quadrupleFilter"><i class="fa-solid fa-tag"></i>四人房</div>
          </div>
          <div class="order">
            <h3>排序方式:</h3>
            <select name="price-sort" id="price-sort" v-model="sortBy">
              <option v-for="(option, index) in sortOptions" :key="index" :value="option.value">{{ option.text }}</option>
            </select>
          </div>
        </div>
      </div>
      <div class="room_block">
        <Room 
          v-for="(room, index) in sortedFilteredRooms" 
          :key="room.id"
          :roomData="room" 
          :hotelDiscount="discount"
          :hotelFee="service_fee"
          @click="roomClickHandler(index)">
        </Room>
        <Teleport to="body">
          <RoomModal 
            v-for="(room, index) in sortedFilteredRooms" 
            :key="room.id"
            v-show="showModal == index"
            :room="room"
            :hotelDiscount="discount"
            :hotelFee="service_fee"
            @close="showModal = -1">
          </RoomModal>
        </Teleport>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../assets/style.scss";
.container{
  width: 100%;
  padding: 1rem 2rem;

  .roomList{
    width: 100%;
    display: flex;
    flex-direction: column;

    .title{
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      h1 {
        width: 100%;
        font-size: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;

        @include sm {
          justify-content: flex-start;
        }
        span {
          font-size: 1rem;
          padding-left: 4px;
        }
      }
      .button{
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 4px;
        padding-top: 4px;
        position: relative;

        @include sm {
          flex-direction: row;
          justify-content: space-between;
        }
        .filter {
          height: 2rem;
          width: max-content;
          display: flex;
          justify-content: center;
          gap: 8px;

          div{
            height: 100%;
            width: max-content;
            font-size: 1rem;
            padding: 2px 10px;
            border: 1px solid grey;
            border-radius: 5px;
            outline: none;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;

            @include md {
              font-size: 1.2rem;
            }
            &:hover,
            .filtering {
              color: white;
              background-color: #4e482f;
            }
            &:hover {
              opacity: .7;
            }
            i{
              margin-right: 5px;
            }
          }
        }
        .order{
          display: flex;
          align-items: center;
          gap: 4px;

          select{
            height: 2rem;
            font-size: 1rem;
            border-radius: 5px;
            padding: 2px 5px;
            outline: none;
            background-color: transparent;
            border: 1px solid black;

            @include sm {
              position: static;
            }
            @include md {
              font-size: 1.2rem;
            }
          }
        }
      }
    }
    .room_block{
      width: 100%;
      display: grid;
      grid-template-columns: repeat(1fr);
      grid-auto-rows: 250px;
      grid-gap: 20px;
      padding-top: 20px;
      box-sizing: border-box;

      @include sm {
        grid-template-columns: 1fr 1fr;
        grid-auto-rows: 250px;
        grid-gap: 30px;
      }
      @include lg {
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: 250px;
      }
      @include xl {
        grid-template-columns: repeat(4, 1fr);
        grid-auto-rows: 250px;
      }
    }
  }
}
</style>

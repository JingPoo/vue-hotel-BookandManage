<script setup>
  import { ref, computed, onMounted } from 'vue'
  import Room from '../components/Room.vue'
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

  onMounted(()=>{
    axios.get('http://localhost:8888/rooms')
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

</script>

<template>
  <div class="container">
    <div class="roomList">
      <div class="title">
        <h1>房間列表 <span>({{ filteredRooms.length }}間)</span></h1>
        <div class="filter">
          <div class="single-filter" :class="{filtering: singleFiltered}" @click="singleFilter"><i class="fa-solid fa-tag"></i>單人房</div>
          <div class="double-filter" :class="{filtering: doubleFiltered}" @click="doubleFilter"><i class="fa-solid fa-tag"></i>雙人房</div>
          <div class="triple-filter" :class="{filtering: tripleFiltered}" @click="tripleFilter"><i class="fa-solid fa-tag"></i>三人房</div>
          <div class="quadruple-filter" :class="{filtering: quadrupleFiltered}" @click="quadrupleFilter"><i class="fa-solid fa-tag"></i>四人房</div>
          <select name="price-sort" id="price-sort" v-model="sortBy">
            <option v-for="(option, index) in sortOptions" :key="index" :value="option.value">{{ option.text }}</option>
          </select>
        </div>
      </div>
      <div class="room_block">
        <Room 
          v-for="(room, index) in sortedFilteredRooms" 
          :key="room.id"
          :room_data="room" 
          :hotel_discount="discount"
          :hotel_fee="service_fee"
          :index="index">
        </Room>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container{
    width: 100%;
    padding: 10px 20px;
  }
  .roomList{
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  .title{
    width: 100%;
    display: flex;
    align-items: center;
  }
  .title h1{
    height: 50px;
    border-bottom: 1px solid rgb(215, 208, 208);
  }
  .title h1 span{
    font-size: 20px;
  }
  .title .filter{
    flex-grow: 1;
    margin-left: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: relative;
  }
  .filter > div{
    height: 30px;
    margin: 0px 10px;
    padding: 2px 10px;
    border: 1px solid grey;
    border-radius: 5px;
    outline: none;
    cursor: pointer;
  }
  .filter div:hover,
  .filtering{
    color: white;
    background-color: #4e482f;
  }
  .filter div:hover{
    opacity: .7;
  }
  .filter i{
    margin-right: 5px;
  }
  .filter select{
    font-size: 16px;
    border-radius: 5px;
    padding: 2px 5px;
    outline: none;
    position: absolute;
    right: 0;
  }
  .room_block{
    width: 100%;
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 250px;
    grid-gap: 20px;
    padding-top: 20px;
    box-sizing: border-box;
  }
  
  /* For Mobile Device */
  @media all and (max-width: 414px){
    .title{
      display: flex;
      flex-direction: column;
    }
    .title h1{
      width: 100%;
      height: 40px;
      margin-bottom: 10px;
      font-size: 26px;
    }
    .title .filter{
      width: 100%;
      margin-left: 0;
    }
    .filter > div{
      height: 24px;
      font-size: 12px;
      margin: 0px 2px;
      padding: 2px 5px;
    }
    .filter select{
      font-size: 12px;
      padding: 2px 2px;
    }
    .room_block{
      display: flex;
      flex-direction: column;
    }
  }

  /* For Small Device */
  @media all and (min-width: 414px) and (max-width: 768px){
    .title{
      display: flex;
      flex-direction: column;
    }
    .title h1{
      width: 100%;
      height: 40px;
      margin-bottom: 10px;
      font-size: 26px;
    }
    .title .filter{
      width: 100%;
      margin-left: 0;
    }
    .filter > div{
      height: 24px;
      font-size: 12px;
      margin: 0px 4px;
      padding: 2px 5px;
    }
    .filter select{
      font-size: 12px;
      padding: 2px 2px;
    }
    .room_block{
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 200px;
    }
  }
  /* For Medium Device */  
  @media all and (min-width: 768px) and (max-width: 992px){
    .filter > div{
      margin: 0px 5px;
    }
    .room_block{
      grid-template-columns: repeat(3, 1fr);
    }
  }
</style>

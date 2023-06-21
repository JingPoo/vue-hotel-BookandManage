<script setup>
  import { ref, onMounted} from 'vue'
  import EditRoom from '../components/EditRoom.vue'
  import axios from 'axios'

  const rooms = ref([])
  const newRoom = ref({
    name: "新房間",
    eng: "New Room",
    size: 2,
    price: 2000,
    amount: 1,
    cover: "https://img.freepik.com/free-photo/small-hotel-bedroom-with-white-walls-panoramic-window_1262-12488.jpg?size=626&ext=jpg&ga=GA1.1.125570085.1686126382&semt=sph",
    discount: 0.9,
    editing: false,
    equipment: {
      wifi: false,
      bathtub: false,
      breakfast: false
    }
  })
  const inputName = ref('')
  const inputEng = ref('')
  const inputSize = ref(0)
  const inputPrice = ref(0)
  const inputDiscount = ref(0)
  const inputCover = ref('')
  const wifiChecked = ref(false)
  const bathtubChecked = ref(false)
  const breakfastChecked = ref(false)

  const discount = ref(0.9) // 飯店折扣
  const service_fee = ref(200) // 服務費
  const edit_id = ref(-1) // 正在編輯的房間index
  const id = ref(rooms.value.length)

  onMounted(()=>{
    axios.get('http://localhost:8888/rooms')
      .then((res)=>{
        rooms.value = res.data
      }).catch((err)=>{
        console.log(err)
      })
  })
  const add_room = (()=>{
    axios.post('http://localhost:8888/rooms', newRoom.value)
      .then((res)=>{
        rooms.value.push(res.data)
        edit_id.value = rooms.value.length - 1
      }).catch((err)=>{
        console.log(err)
      })
  })
  const delete_room = ((index)=>{
    let target = rooms.value[index]
    if(confirm(`是否刪除 ${target.name}?`)){
      axios.delete('http://localhost:8888/rooms/' + target.id)
        .then((res)=>{
          rooms.value.splice(index, 1)
        }).catch((err)=>{
        console.log(err)
      })
    }
  })
  const editClickHandler = ((index)=>{
    if(edit_id.value == index){
      edit_id.value = -1
    }
    else{
      edit_id.value = index
    }
  })

  const nameEditHandler = ((index)=>{
    inputName.value = rooms.value[index].name
    let id = rooms.value[index].id
    if(!inputName.value) return 
    else{
      axios.patch('http://localhost:8888/rooms/' + id, {name: inputName.value})
      .then((res)=>{
        rooms.value[index].name = res.data.name
        inputName.value = {name: ''}
      }).catch((err)=>{
        console.log(err)
    })
    }
  })
  const engEditHandler = ((index)=>{
    inputEng.value = rooms.value[index].eng
    let id = rooms.value[index].id
    if(!inputEng.value) return 
    else{
      axios.patch('http://localhost:8888/rooms/' + id, {eng: inputEng.value})
        .then((res)=>{
          rooms.value[index].eng = res.data.eng
          inputEng.value = {eng: ''}
        }).catch((err)=>{
          console.log(err)
      })
    }
  })
  const sizeEditHandler = ((index)=>{
    inputSize.value = rooms.value[index].size
    let id = rooms.value[index].id
    if(!inputSize.value || inputSize.value < 0 || inputSize.value > 4) return 
    else{
      axios.patch('http://localhost:8888/rooms/' + id, {size: inputSize.value})
        .then((res)=>{
          rooms.value[index].size = res.data.size
          inputSize.value = {size: ''}
        }).catch((err)=>{
          console.log(err)
      })
    }
  })
  const priceEditHandler = ((index)=>{
    inputPrice.value = rooms.value[index].price
    let id = rooms.value[index].id
    if(!inputPrice.value || inputPrice.value < 0) return 
    else{
      axios.patch('http://localhost:8888/rooms/' + id, {price: inputPrice.value})
        .then((res)=>{
          rooms.value[index].price = res.data.price
          inputPrice.value = {price: ''}
        }).catch((err)=>{
          console.log(err)
      })
    }
  })
  const discountEditHandler = ((index)=>{
    inputDiscount.value = rooms.value[index].discount
    let id = rooms.value[index].id
    if(!inputDiscount.value || inputDiscount.value < 0 || inputDiscount.value > 1) return 
    else{
      axios.patch('http://localhost:8888/rooms/' + id, {discount: inputDiscount.value})
        .then((res)=>{
          rooms.value[index].discount = res.data.discount
          inputDiscount.value = {discount: ''}
        }).catch((err)=>{
          console.log(err)
      })
    }
  })
  const coverEditHandler = ((index)=>{
    inputCover.value = rooms.value[index].cover
    let id = rooms.value[index].id
    if(!inputCover.value) return 
    else{
      axios.patch('http://localhost:8888/rooms/' + id, {cover: inputCover.value})
        .then((res)=>{
          rooms.value[index].cover = res.data.cover
          inputCover.value = {cover: ''}
        }).catch((err)=>{
          console.log(err)
      })
    }
  })

  const wifiCheckHandler = ((index)=>{
    wifiChecked.value = rooms.value[index].equipment.wifi
    let id = rooms.value[index].id
    axios.patch('http://localhost:8888/rooms/' + id, {
      equipment:{
        wifi: wifiChecked.value,
        bathtub: rooms.value[index].equipment.bathtub,
        breakfast: rooms.value[index].equipment.breakfast
      }
    })
  })
  const bathtubCheckHandler = ((index)=>{
    bathtubChecked.value = rooms.value[index].equipment.bathtub
    let id = rooms.value[index].id
    axios.patch('http://localhost:8888/rooms/' + id, {
      equipment:{
        wifi: rooms.value[index].equipment.wifi,
        bathtub: bathtubChecked.value,
        breakfast: rooms.value[index].equipment.breakfast
      }
    })
  })
  const breakfastCheckHandler = ((index)=>{
    breakfastChecked.value = rooms.value[index].equipment.breakfast
    let id = rooms.value[index].id
    axios.patch('http://localhost:8888/rooms/' + id, {
      equipment:{
        wifi: rooms.value[index].equipment.wifi,
        bathtub: rooms.value[index].equipment.bathtub,
        breakfast: breakfastChecked.value
      }
    })
  })
</script>

<template>
  <div class="container">
    <div class="wrapper">
      <div class="roomData">
        <h1>房間資料</h1>
        <div class="data_block">
          <label for="discount">總折數</label>
          <input type="number" id="discount" min="0.01" max="0.99" step="0.01" v-model.trim="discount">
          <label for="service_fee">服務費</label>
          <input type="number" id="service_fee" min="0" v-model.trim="service_fee">
          <h1>房間編輯</h1> 
          <!-- <select v-model="edit_id">
            <option v-for="(room, index) in rooms" :key="room.id" :value="index"> {{ room.name }} </option>
          </select> -->
          <div class="add_room">
            <button class="add_room_btn" @click="add_room">+新增房間</button>
          </div>
          <div class="room_edit" v-for="(room, index) in rooms" :key="room.id">
            <div class="title" :class="{editing: edit_id == index}" @click="editClickHandler(index)">
              <h4> {{ room.name }} </h4>
              <i class="fa-solid fa-trash-can" @click="delete_room(index)"></i>
            </div>
            <div class="edit_part" v-if="edit_id == index">
              <label for="room_name">房間名稱</label>
              <input type="string" id="room_name" v-model.trim="room.name" @input="nameEditHandler(index)">
              <label for="room_eng">英文名稱</label>
              <input type="string" id="room_eng" v-model.trim="room.eng" @input="engEditHandler(index)">
              <label for="room_size">容納人數</label>
              <input type="number" id="room_size" min="1" max="4" v-model.trim="room.size" @input="sizeEditHandler(index)">
              <label for="room_price">價格</label>
              <input type="number" min="1" id="room_price" v-model.trim="room.price" @input="priceEditHandler(index)">
              <label for="room_dicount">折扣</label>
              <input type="number" min="0.01" max="0.99" step="0.01" id="room_dicount" v-model.trim="room.discount" @input="discountEditHandler(index)">
              <label for="room_cover">圖片網址</label>
              <input type="string" id="room_cover" v-model.trim="room.cover" @input="coverEditHandler(index)">
              <label>房間設備</label>
              <div class="equipment">
                <div class="checkbox_box">
                  <input type="checkbox" id="wifi" name="wifi" v-model="room.equipment.wifi" @change="wifiCheckHandler(index)">
                  <label for="wifi">wifi</label>
                </div>
                <div class="checkbox_box">
                  <input type="checkbox" id="bathtub" name="bathtub" v-model="room.equipment.bathtub" @change="bathtubCheckHandler(index)">
                  <label for="bathtub">浴缸</label>  
                </div>
                <div class="checkbox_box">
                  <input type="checkbox" id="breakfast" name="breakfast" v-model="room.equipment.breakfast" @change="breakfastCheckHandler(index)">
                  <label for="breakfast">早餐</label> 
                </div>
              </div>
            </div>
          </div>          
        </div>
      </div>
      <div class="roomList">
        <h1>房間列表 <span>({{ rooms.length }}間)</span></h1>
        <div class="room_block">
          <EditRoom 
            v-for="(room, index) in rooms" 
            :key="room.id"
            :room_data="room" 
            :hotel_discount="discount"
            :hotel_fee="service_fee"
            :index="index"
            @deleteRoom="delete_room">
          </EditRoom>
        </div>
      </div>
    </div>   
  </div>
</template>

<style scoped>
  .container{
    width: 100%;
    /* height: auto; */
  }
  .wrapper{
    width: 100%;
    padding: 10px;
    display: flex;
  }
  .roomData{
    width: 250px;
    min-width: 190px;
    margin-right: 20px;
    overflow-y: scroll;
    padding: 0px 20px;
    background-color: #ebe9e1;
    border-radius: 10px;
  }
  input,
  fieldset{
    min-width: 80px;
  }
  .roomData h1{
    height: 50px;
    border-bottom: 1px solid rgb(215, 208, 208);
  }
  .data_block{
    flex-grow: 1;
    margin-top: 10px;
    display: flex;
    flex-direction: column;
  }
  .data_block > input{
    height: 30px;
    border-radius: 5px;
    border: none;
    outline: none;
    margin: 10px 0px;
    padding: 0 10px;
  }
  /* .data_block select{
    font-size: 16px;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 5px 0px ;
  } */
  .add_room{
    width: 100%;
    display: flex;
    justify-content: flex-start;
  }
  .add_room_btn{
    color: white;
    background-color: #635e5e;
    border: none;
    border-radius: 5px;
    padding: 5px 10px;
    font-size: 16px;
    margin: 10px 0px;
    cursor: pointer;
  }
  .add_room_btn:hover{
    opacity: .8;
  }
  .room_edit{
    display: flex;
    flex-direction: column;
  }
  .room_edit .title{
    width: 100%;
    min-width: 100px;
    height: 40px;
    font-size: 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
    border: 1px solid #aaa;
    border-left: 4px solid #adaaaa;
    border-radius: 0px 5px 5px 0px;
    margin: 10px 0px;
    padding: 0px 10px;
    position: relative;
  }
  .room_edit .title:hover,
  .editing{
    color: white;
    background-color: #6c6c6a;
  }
  .room_edit .title i{
    cursor: pointer;
    position: absolute;
    right: 10px;
  }
  .room_edit .title i:hover{
    color: rgb(193, 108, 108);
  }
  .edit_part{
    display: flex;
    flex-direction: column;
  }
  .edit_part > input{
    height: 25px;
    border-radius: 5px;
    border: none;
    outline: none;
    margin: 5px 0px;
    padding: 0 10px;
  }
  .edit_part .equipment{
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid grey;
    border-radius: 2px;
    font-size: 14px;
    margin-top: 5px;
    padding-right: 30px;
  }
  .equipment .checkbox_box{
    width: 33%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .equipment input{
    width: 30%;
  }
  .equipment label{
    width: 70%;
    margin-left: -25px;
  }
  .roomList{
    width: calc(100% - 250px);
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }
  .roomList h1{
    height: 50px;
    border-bottom: 1px solid rgb(215, 208, 208);
  }
  .roomList h1 span{
    font-size: 20px;
  }
  .room_block{
    flex-grow: 1;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 250px;
    grid-gap: 20px;
    padding-top: 20px;
  }
  
  /* For Mobile Device */
  @media all and (max-width: 414px){
    .roomData{
      width: 80%;
      margin: auto;
    }
    .roomList{
      display: none;
    }
  }
  /* For Small Device */
  @media all and (min-width: 414px) and (max-width: 768px){
    .roomData{
      width: 200px;
    }
    .roomList{
      width: calc(100% - 200px);
    }
    .room_block{
      width: 90%;
      margin: auto;
      display: flex;
      flex-direction: column;
    }
  }
  /* For Medium Device */  
  @media all and (min-width: 768px) and (max-width: 992px){
    .room_block{
      grid-template-columns: repeat(2, 1fr);
    }
  }
</style>

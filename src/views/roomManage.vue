<script setup>
  import { ref, onMounted, onUpdated} from 'vue'
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
    axios.get('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms')
      .then((res)=>{
        rooms.value = res.data
      }).catch((err)=>{
        console.log(err)
      })
  })
  const add_room = (()=>{
    axios.post('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms', newRoom.value)
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
      axios.delete('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms/' + target.id)
        .then((res)=>{
          rooms.value.splice(index, 1)
        }).catch((err)=>{
        console.log(err)
      })
    }
  })
  // // 讓視窗捲動到編輯處
  // onUpdated(()=>{
  //   const el = document.querySelector('.editing')
  //   if(el){
  //     let top = el.getBoundingClientRect().top
  //     window.scrollTo(0, top)
  //   }
  // })
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
      axios.patch('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms/' + id, {name: inputName.value})
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
      axios.patch('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms/' + id, {eng: inputEng.value})
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
      axios.patch('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms/' + id, {size: inputSize.value})
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
      axios.patch('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms/' + id, {price: inputPrice.value})
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
      axios.patch('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms/' + id, {discount: inputDiscount.value})
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
      axios.patch('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms/' + id, {cover: inputCover.value})
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
    axios.patch('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms/' + id, {
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
    axios.patch('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms/' + id, {
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
    axios.patch('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms/' + id, {
      equipment:{
        wifi: rooms.value[index].equipment.wifi,
        bathtub: rooms.value[index].equipment.bathtub,
        breakfast: breakfastChecked.value
      }
    })
  })
</script>

<template>
  <div class="container" v-if="rooms.length">
    <div class="wrapper">
      <div class="roomData">
        <h1>房間資料</h1>
        <div class="data_block">
          <label for="discount">總折數</label>
          <input type="number" id="discount" min="0.01" max="0.99" step="0.01" v-model.trim="discount">
          <label for="service_fee">服務費</label>
          <input type="number" id="service_fee" min="0" v-model.trim="service_fee">
          <h1>房間編輯</h1> 
          <div class="add_room">
            <button class="add_room_btn" @click="add_room">+新增房間</button>
          </div>
          <div class="room_edit" v-for="(room, index) in rooms" :key="room.id">
            <div class="title" :class="{editing: edit_id == index}" @click="editClickHandler(index)">
              <h4> {{ room.name }} </h4>
              <i class="fa-solid fa-trash-can" @click="delete_room(index)"></i>
            </div>
            <div class="edit_part" v-show="edit_id == index">
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
            :roomData="room" 
            :hotelDiscount="discount"
            :hotelFee="service_fee"
            :index="index"
            @deleteRoom="delete_room"
            @editRoom="editClickHandler">
          </EditRoom>
        </div>
      </div>
    </div>   
  </div>
  <div class="loading" v-else>
    Loading...
  </div>
</template>

<style scoped lang="scss">
 @import "../assets/style.scss";
.container{
  width: 100%;

  .wrapper{
    width: 100%;
    padding: 10px 20px;
    display: flex;

    @include sm {
      padding-top: 20px
    }

    .roomData{
      width: 100%;
      min-width: max-content;
      margin-right: 20px;
      padding: 1rem 2rem;
      background-color: #ebe9e1;
      border-radius: 5px;
      box-shadow: 0px 0px 5px darken($primary, 50);
    
      @include sm {
        width: 25rem;
        padding-top: 0;
      }
      input,
      fieldset{
        min-width: max-content;
      }
      h1{
        height: 3rem;
        border-bottom: 1px solid rgb(215, 208, 208);
      }
      .data_block{
        flex-grow: 1;
        margin-top: 10px;
        display: flex;
        flex-direction: column;

        > input{
          height: 3rem;
          font-size: 1.2rem;
          border-radius: 5px;
          border: none;
          outline: none;
          margin: 10px 0px;
          padding: 0 10px;
        }
        .add_room{
          width: 100%;
          display: flex;
          justify-content: flex-start;

          button {
            color: white;
            background-color: #635e5e;
            border: none;
            border-radius: 5px;
            padding: 5px 10px;
            font-size: 1.3rem;
            margin: 10px 0px;
            cursor: pointer;

            &:hover {
              opacity: .8;
            }
          }
        }
        .room_edit{
          display: flex;
          flex-direction: column;

          .title{
            width: 100%;
            min-width: max-content;
            height: 3rem;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            cursor: pointer;
            border: 1px solid #aaa;
            border-left: 4px solid #adaaaa;
            border-radius: 0px 5px 5px 0px;
            margin: 10px 0px;
            padding: 0px 10px;
            position: relative;

            &:hover,
            .editing {
              color: white;
              background-color: #6c6c6a;
            }
            i{
              cursor: pointer;
              position: absolute;
              right: 10px;

              &:hover {
                color: rgb(193, 108, 108);
              }
            }
          }
          .edit_part{
            display: flex;
            flex-direction: column;

            > input{
              height: 2.4rem;
              font-size: 1rem;
              border-radius: 5px;
              border: none;
              outline: none;
              margin: 5px 0px;
              padding: 0 10px;
            }
            .equipment{
              width: 100%;
              height: 4rem;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid grey;
              border-radius: 2px;
              font-size: 1.2rem;
              margin-top: 5px;
              padding-right: 1.2rem;

              .checkbox_box{
                width: 33%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                
                input {
                  outline: none;
                }
              }
            }
          }
        } 
      }
    }
    .roomList{
      display: none;
      width: calc(100% - 250px);
      flex-grow: 1;

      @include sm {
        display: flex;
        flex-direction: column;
      }
      
      h1{
        height: 50px;
        border-bottom: 1px solid rgb(215, 208, 208);

        span{
          font-size: 20px;
        }
      }
      .room_block{
        // flex-grow: 1;
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-rows: 200px;
        grid-gap: 20px;
        padding-top: 20px;

        @include lg {
          grid-template-columns: 1fr 1fr;
        }
        @include xl {
          grid-template-columns: repeat(3, 1fr);
        }
      }
    }
  }
}
.loading {
  text-align: center;
  margin-top: 3rem;
}
</style>

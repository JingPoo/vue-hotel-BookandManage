<script setup>
import { ref, onBeforeMount, onMounted } from 'vue'
import axios from 'axios'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import RoomModal from '../components/RoomModal.vue'

const store = useStore()
const router = useRouter()
const user = store.state.user
const reserved = ref([])
const rooms = ref([])
const showModal = ref(-1)
const discount = ref(store.state.discount)
const service_fee = ref(store.state.serviceFee)

onMounted(()=>{
  axios.get('https://my-json-server.typicode.com/JingPoo/vue-hotel-BookandManage/rooms')
    .then((res)=>{
      rooms.value = res.data
    }).catch((err)=>{
      console.log(err)
    })
})
onBeforeMount(()=>{
    if(user) {
        reserved.value = JSON.parse(localStorage.getItem(store.state.user['uid'])) || []
    }
})
const deleteReserve = () => {
    if(confirm('確定取消此筆訂單?')) {
        localStorage.setItem(store.state.user['uid'], JSON.stringify([]))
        router.go(0)
    }
}
</script>
<template>
    <div>
        <div class="container" v-if="reserved.length">
            <div v-for="r in reserved" class="room" @click="showModal = r.id">
                <img :src="r.cover">
                <div class="info">
                    <h4 class="date">{{ r.date }}</h4>
                    <h3>{{ r.name }}</h3>
                    <h4>{{ r.eng }}</h4>
                </div>
                <div class="additionalL">
                    <i v-show="r.equip.wifi" class="fa-solid fa-wifi"></i>
                    <i v-show="r.equip.bathtub" class="fa-solid fa-bath"></i>
                    <i v-show="r.equip.breakfast" class="fa-solid fa-mug-saucer"></i>
                </div>
                <div class="additionalR">
                    <h4>${{ r.final_price }}</h4>
                </div>
            </div>
            <!-- <button @click="deleteReserve">取消訂單</button> -->
        </div>
        <div v-else class="noreserve">
            <h3>您尚未有訂單</h3>
            <p>請至<router-link to="/">飯店首頁</router-link>下訂</p>
        </div>
        <Teleport to="body">
            <RoomModal 
                v-for="room in rooms" 
                :key="room.id"
                v-show="showModal == room.id"
                :room="room"
                :hotelDiscount="discount"
                :hotelFee="service_fee"
                @close="showModal = -1">
            </RoomModal>
        </Teleport>
    </div>
    
</template>
<style scoped lang="scss">
@import "../assets/style.scss";
.container {
    width: 100%;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .room {
        width: 300px;
        margin: 0 auto;
        background-color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0px 0px 5px lightgray;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        cursor: pointer;
        position: relative;
        transition: all .5s;

        @include sm {
            width: 400px;
            padding: 2rem;
        }
        @include md {
            width: 500px;
            flex-direction: row;
        }
        @include lg {
            width: 600px;
            gap: 2rem;
        }
        &:hover {
            opacity: .8;
            box-shadow: 0px 0px 10px $primary;
            
            @include md {
                box-shadow: 70px 0px $primary, -50px 0px $primary;

                .additionalL {
                    opacity: 1;
                    transform: translateX(-100%);
                }
                .additionalR {
                    opacity: 1;
                    transform: translateX(100%);
                }
            }
        }
        img {
            width: 14rem;
            height: 10rem;

            @include sm {
                width: 16rem;
                height: 11rem;
            }
            @include md {
                width: 18rem;
                height: 12rem;
            }
        }
        h3 {
            font-size: 1.6rem;
            font-weight: bold;
            color: $info;
        }
        h4 {
            font-size: 1.3rem;
            text-align: center;
        }
        .info {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;
        }
        .additionalL,
        .additionalR {
            width: 100%;
            display: flex;
            width: max-content;
            transition: all .5s;
        }
        .additionalL {

            @include md {
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                position: absolute;
                top: 0;
                left: 0;
                padding-right: 10px;
                height: 100%;
                opacity: 0;
            }
            i {
                font-size: 1.2rem;
            }
        }
        .additionalR {

            @include md {
                flex-direction: column;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 0;
                right: 0;
                padding-left: 10px;
                height: 100%;
                opacity: 0;
            }
        }
        
        
    }
    button {
        font-size: 1.2rem;
        font-weight: bold;
        border: 3px solid $error;
        border-radius: 5px;
        background-color: white;
        padding: 4px 12px;
        margin-top: 1rem;
        margin: 0 auto;
        cursor: pointer;

        &:hover{
            color: white;
            background-color: $error;
        }
    }
}
.noreserve {
    width: 20rem;
    margin: 0 auto;
    margin-top: 4rem;
    border: 1px solid black;
    box-shadow: 0px 0px 5px darkgray;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
    
    h3 {
        font-size: 2rem;
    }
    p {
        font-size: 1rem;

        a {
            text-decoration: none;
            font-size: 1.6rem;
            color: $info;
            font-weight: bold;

            &:hover {
                opacity: .8;
            }
        }
    }
}
</style>
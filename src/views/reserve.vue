<script setup>
import { ref, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const user = store.state.user
const reserved = ref([])
const rooms = ref([])
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
            <div v-for="r in reserved" class="room">
                <h3>{{ r.name }}</h3>
                <h4>每晚${{ r.final_price }}</h4>
            </div>
            <!-- <button @click="deleteReserve">取消訂單</button> -->
        </div>
        <div v-else class="noreserve">
            <h3>您尚未有訂單</h3>
            <p>請至<router-link to="/">飯店首頁</router-link>下訂</p>
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
    
</template>
<style scoped lang="scss">
@import "../assets/style.scss";
.container {
    width: 100%;
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .room {
        width: 100%;
        background-color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0px 0px 5px lightgray;
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 2rem;

        h3 {
            font-size: 1.8rem;
            font-weight: bold;
            color: $info;
        }
        h4 {
            font-size: 1.4rem;
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
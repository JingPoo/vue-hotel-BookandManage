<script setup>
import { computed } from 'vue'

const props = defineProps({
    roomData: {
        type: Object,
        required: true
    },
    hotelDiscount: {
        type: Number,
        default: 0.9
    },
    hotelFee: {
        type: Number,
        default: 200
    }
})

const final_discount = computed(()=>{
    return props.roomData.discount * props.hotelDiscount
})
const final_discount_show = computed(()=>{
    return parseInt(final_discount.value*100)
})
const final_price = computed(()=>{
    return parseInt(props.roomData.price * final_discount.value + props.hotelFee * 1.0)
})
const bg_css = computed(()=>{
    // const roomCover = new URL(props.roomData.cover, import.meta.url).href;
    return {
        backgroundImage: `url(${props.roomData.cover})`
    }
})
</script>

<template>
    <div class="room_container">
        <div class="cover" :style="bg_css">
            <h3> {{ roomData.name }} </h3>
            <h5> {{  final_discount_show }}折</h5>
        </div>
        <div class="info">
            <div class="nameIcon">
                <h5> {{ roomData.eng }} </h5>
                <div class="icons">
                    <i v-show="roomData.equipment.wifi" class="fa-solid fa-wifi"></i>
                    <i v-show="roomData.equipment.bathtub" class="fa-solid fa-bath"></i>
                    <i v-show="roomData.equipment.breakfast" class="fa-solid fa-mug-saucer"></i>
                </div>
            </div>
            <h4> TWD <span>{{ roomData.price }}</span></h4>
            <div class="final_price"> 
                {{ final_price }}
            </div>
        </div>
    </div> 
</template>

<style scoped lang="scss">
.room_container {
    width: 100%;
    min-width: 150px;
    height: 100%;
    min-height: 150px;
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    box-shadow: 0px 0px 10px grey;
    cursor: pointer;

    &:hover {
        opacity: .9;
        .cover h3{
            transform: translateX(20px);
        }
        .final_price{
            font-size: 25px;
            font-weight: bolder;
        }
    }
    .cover{
        width: 100%;
        height: 60%;
        background-color: #eee;
        position: relative;
        background-size: cover;
        background-position: center center;
        border-radius: 10px 10px 0 0;

        h3{
            font-size: 20px;
            background-color: #fff;
            padding: 5px 10px;
            position: absolute;
            left: 0;
            bottom: 10%;
            opacity: .9;
            transition: transform .5s;
        }
        h5{
            width: 50px;
            text-align: center;
            position: absolute;
            top: -5px;
            right: -5px;
            font-size: 20px;
            color: white;
            background-color: rgb(225, 83, 83);
            border-radius: 5px;
        }
    }
    .info{
        width: 100%;
        height: 40%;
        display: flex;
        flex-direction: column;
        padding: 10px;
        position: relative;

        .nameIcon{
            display: flex;

            .icons{
                display: inline;
                padding-left: 10px;
                color: #5f5b5b;
                font-size: 12px;

                i{
                    margin: 0 2px;
                }
            }
            h5{
                font-size: 12px;
            }
        }
        .final_price{
            font-size: 20px;
            color: rgb(225, 83, 83);
            position: absolute;
            right: 10px;
            bottom: 10px;

            &::before {
                content: '$';
            }
        }
        > h4 > span{
            text-decoration: line-through;
        }
    }
}
</style>
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
    return {
        backgroundImage: `url(${props.roomData.cover})`
    }
})
</script>

<template>
<div class="room_container" >
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
        <div class="price">
            <h4> TWD <span>{{ roomData.price }}</span> <span></span></h4>
            <div class="final_price"> 
                {{ final_price }}/晚
            </div>
        </div>
        
    </div>
</div> 
</template>

<style scoped lang="scss">
.room_container {
    width: 100%;
    height: 200px;
    display: flex;
    box-shadow: 0px 0px 10px grey;
    cursor: pointer;
    border-radius: 10px;

    &:hover {
        opacity: .9;
        .cover h3{
            transform: translateX(50px);
        }
        .final_price{
            font-size: 25px;
            font-weight: bolder;
        }
    }
    .cover{
        width: 140%;
        height: 100%;
        flex-grow: 1;
        background-color: #eee;
        position: relative;
        background-size: cover;
        background-position: center center;
        border-radius: 10px 0px 0px 10px;

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
            top: -10px;
            right: -25px;
            font-size: 20px;
            color: white;
            background-color: rgb(225, 83, 83);
            border-radius: 5px;
        }
    }
    .info{
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px;
        position: relative;

        .nameIcon{
            width: 100%;
            padding-top: 20px;
            display: flex;
            flex-direction: column;

            h5{
                font-size: 16px;
            }
            .icons{
                display: inline;
                padding-top: 10px;
                color: #5f5b5b;
                font-size: 14px;

                i{
                    margin: 0 2px;
                }
            }
        }
        .price{
            padding-top: 10px;

            > h4 > span{
                text-decoration: line-through;
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
        }
        
    }
}
</style>
<script setup>
    import { ref, computed } from 'vue'

    const props = defineProps({
        room_data: Object,
        hotel_discount: Number,
        hotel_fee: Number,
        index: Number
    })

    const final_discount = computed(()=>{
        return props.room_data.discount * props.hotel_discount
    })
    const final_discount_show = computed(()=>{
        let number = final_discount.value * 100
        if(number % 10 == 0){
            return parseInt(final_discount.value * 10)
        }
        else if(number < 10){
            return (final_discount.value * 10).toFixed(2)
        }
        return parseInt(final_discount.value * 100)
    })
    const final_price = computed(()=>{
        return parseInt(props.room_data.price * final_discount.value + props.hotel_fee * 1.0)
    })
    const bg_css = computed(()=>{
        return {
            backgroundImage: `url(${props.room_data.cover})`
        }
    })
</script>

<template>
    <div class="room_container">
        <div class="cover" :style="bg_css">
            <h3> {{ room_data.name }} </h3>
            <i class="fa-regular fa-circle-xmark" @click="$emit('deleteRoom', index)"></i>
        </div>
        <div class="info">
            <div class="nameIcon">
                <h5> {{ room_data.eng }} </h5>
                <div class="icons">
                    <i v-show="room_data.equipment.wifi" class="fa-solid fa-wifi"></i>
                    <i v-show="room_data.equipment.bathtub" class="fa-solid fa-bath"></i>
                    <i v-show="room_data.equipment.breakfast" class="fa-solid fa-mug-saucer"></i>
                </div>
            </div>
            <h5> {{ room_data.discount }} * {{ hotel_discount }} = {{  final_discount_show }}折</h5>
            <h4> TWD <span>{{ room_data.price }}</span></h4>
            <div class="final_price" > 
                {{ final_price }}
            </div>
        </div>
    </div> 
</template>

<style scoped>
    .room_container{
        width: 100%;
        min-width: 200px;
        height: 100%;
        min-height: 150px;
        display: flex;
        flex-direction: column;
        box-shadow: 0px 0px 10px grey;
        cursor: pointer;
    }
    .room_container:hover{
        opacity: .9;
        /* box-shadow: 0px 0px 2px 4px rgb(162, 180, 206); */
    }
    .room_container:hover .cover h3{
        transform: translateX(20px);
    }
    .cover{
        width: 100%;
        height: 60%;
        background-color: #eee;
        position: relative;
        background-size: cover;
        background-position: center center;
    }
    .cover h3{
        font-size: 20px;
        background-color: #fff;
        padding: 5px 10px;
        position: absolute;
        left: 0;
        bottom: 10%;
        opacity: .9;
        transition: transform .5s;
    }
    .cover i{
        font-size: 20px;
        position: absolute;
        top: 5px;
        right: 5px;
        cursor: pointer;
    }
    .cover i:hover{
        color: rgb(193, 108, 108);
    }
    .info{
        width: 100%;
        height: 40%;
        display: flex;
        flex-direction: column;
        padding: 10px;
        position: relative;
    }
    .nameIcon{
        display: flex;
    }
    .nameIcon .icons{
        padding-left: 10px;
        color: #5f5b5b;
        font-size: 12px;
    }
    .nameIcon .icons i{
        margin: 0 2px;
    }
    .info h5{
        font-size: 12px;
    }
    .info .icons{
        display: inline;
    }
    .info .final_price{
        color: rgb(225, 83, 83);
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
    .info .final_price::before{
        content: '$';
    }
    .info > h4 > span{
        text-decoration: line-through;
    }
    
    /* For Small Device */
    @media all and (min-width: 414px) and (max-width: 768px){
        .room_container{
            min-width: 200px;
            height: 200px;
        }
        .info .final_price{
            right: 50px;
            bottom: 10px;
         }   
    }
</style>
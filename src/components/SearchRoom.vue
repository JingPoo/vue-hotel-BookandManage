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
        return parseInt(final_discount.value*100)
    })
    const final_price = computed(()=>{
        return parseInt(props.room_data.price * final_discount.value + props.hotel_fee * 1.0)
    })
    const bg_css = computed(()=>{
        return {
            backgroundImage: "url('" + props.room_data.cover + "')"
        }
    })

</script>

<template>
    <div class="room_container" >
        <div class="cover" :style="bg_css">
            <h3> {{ room_data.name }} </h3>
            <h5> {{  final_discount_show }}折</h5>
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
            <div class="price">
                <h4> TWD <span>{{ room_data.price }}</span> <span></span></h4>
                <div class="final_price"> 
                    {{ final_price }}/晚
                </div>
            </div>
            
        </div>
    </div> 
</template>

<style scoped>
    .room_container{
        width: 100%;
        height: 200px;
        display: flex;
        box-shadow: 0px 0px 10px grey;
        cursor: pointer;
        border-radius: 10px;
    }
    .room_container:hover{
        opacity: .9;
        /* box-shadow: 0px 0px 2px 4px rgb(162, 180, 206); */
    }
    .room_container:hover .cover h3{
        transform: translateX(50px);
    }
    .room_container:hover .final_price{
        font-size: 25px;
        font-weight: bolder;
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
    .cover h5{
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
    .info{
        width: 60%;
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 10px;
        position: relative;
    }
    .nameIcon{
        width: 100%;
        padding-top: 20px;
        display: flex;
        flex-direction: column;
    }
    .nameIcon .icons{
        padding-top: 10px;
        color: #5f5b5b;
        font-size: 14px;
    }
    .nameIcon .icons i{
        margin: 0 2px;
    }
    .price{
        padding-top: 10px;
    }
    .price > h4 > span{
        text-decoration: line-through;
    }
    .info h5{
        font-size: 16px;
    }
    .info .icons{
        display: inline;
    }
    .final_price{
        font-size: 20px;
        color: rgb(225, 83, 83);
        position: absolute;
        right: 10px;
        bottom: 10px;
    }
    .final_price::before{
        content: '$';
    }
    
    /* For Small Device */
    @media all and (min-width: 414px) and (max-width: 768px){
        .room_container{
            min-width: 200px;
            flex-direction: column;
        }
        .cover{
            width: 100%;
            height: 60%;
        }
        .cover h5{
            top: -5px;
            right: -5px;
        }
        .info{
            width: 100%;
            height: 40%;
        }
        .info h5{
            font-size: 12px;
        }
        .nameIcon{
            flex-direction: row;
            align-items: center;
            padding-top: 0;
        }
        .final_price{
            font-size: 16px;
        }
    }
</style>
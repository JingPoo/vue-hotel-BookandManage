<script setup>
import { computed } from 'vue'
const props = defineProps({
  room: {
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
const final_price = computed(()=>{
    return parseInt(props.room.price * props.room.discount * props.hotelDiscount + props.hotelFee * 1.0)
})
</script>

<template>
  <Transition name="modal">
    <div class="modal-mask" @click.self="$emit('close')">
      <div class="modal-container">
        
        <div class="modal-header">
          <button class="close" @click="$emit('close')">
            <i class="fa-solid fa-xmark"></i>
          </button>
          <div class="name">
            <h1>{{ room.name }}</h1>
            <h4>{{ room.eng }}</h4>
          </div>
          <div class="icons">
            <i v-show="room.equipment.wifi" class="fa-solid fa-wifi"></i>
            <i v-show="room.equipment.bathtub" class="fa-solid fa-bath"></i>
            <i v-show="room.equipment.breakfast" class="fa-solid fa-mug-saucer"></i>
          </div>
        </div>

        <div class="modal-body">
          <img :src="room.cover">
        </div>

        <div class="modal-footer">
          <h6> TWD <span> {{ room.price }} </span></h6>
          <h3>${{ final_price }}</h3>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss">
@import "../assets/style.scss";
.modal-mask{
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  transition: opacity 0.3s ease;

  .modal-container{
    width: 90%;
    height: 26rem;
    margin: auto;
    padding: 10px 20px;
    background-color: #edeceaf6;
    border-radius: 10px;
    box-shadow: 0 0px 10px rgba(0, 0, 0, 0.5);
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    position: relative;

    @include sm {
      height: 32rem;
    }
    @include md {
      width: 48rem;
      height: 32rem;
    }
    @include lg {
      width: 58rem;
      height: 36rem;
    }
    .modal-header{
      width: 100%;
      height: 20%;
      display: flex;
      justify-content: center;
      align-items: center;

      .close{
        position: absolute;
        top: 30px;
        right: 30px;
        font-size: 30px;
        border: none;
        color: rgb(62, 60, 60);
        background-color: rgba(255,255,255,0);
        cursor: pointer;

        &:hover {
          color: rgb(193, 108, 108);
        }
      }
      .icons{
        margin-left: 20px;
        display: flex;
        gap: 5px;
      }
    }
    .modal-body{
      width: 100%;
      height: 60%;
      display: flex;
      justify-content: center;
      align-items: center;

      img{
        width: 90%;
        height: 14rem;

        @include sm {
          height: 18rem;
        }
        @include md {
          width: 36rem;
          height: 20rem;
        }
        @include lg {
          width: 42rem;
          height: 23rem;
        }
      }
    }
    .modal-footer{
      width: 100%;
      height: 20%;
      font-size: 22px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      span{
        text-decoration: line-through;
      }
      h3{
        color: rgb(225, 83, 83);
      }
    }
  }
}

.modal-enter-from {
  opacity: 0;
}
.modal-leave-to {
  opacity: 0;
}
.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(1.1);
}
</style>
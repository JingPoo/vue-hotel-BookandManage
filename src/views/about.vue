<script setup>
import { ref, onMounted } from 'vue' 
const scroll = ref(false)
const total = ref(3)
const animationDuration = 10
const active = ref(0)
const preactive = ref(0)
const pictures = ref([{id: 1, url: '../src/assets/1.jpg'}, 
                    {id: 2, url: '../src/assets/2.jpg'}, 
                    {id: 3, url: '../src/assets/3.jpg'}])              

const img = function(url){
    return{
        background: `url(${url}) no-repeat center / 150% auto`,
        animationDuration: `${animationDuration}s`,
    }
}
onMounted(() => {
    window.addEventListener('scroll', function(){
        scroll.value = (window.scrollY > 0)
    })
})   
setInterval(function(){
    preactive.value = active.value
    active.value = (active.value + 1 + total.value) % total.value
}, animationDuration/2*1000)

</script>
<template>
    <div class="container">
        <div class="kv">
            <ul class="kvList"  :class="{'small':scroll}">
                <li v-for="picture in pictures" :key="picture.id" :style="img(picture.url)" class="w-full h-full absolute opacity-0" :class="{'animate': active === picture.id-1 || preactive === picture.id-1}"></li>
            </ul>
            <div class="text w-full h-20 flex justify-center absolute bottom-20 -z-10" :class="{'show': scroll}">
                <h2>RELAX AND HAVE FUN</h2>
                <h2>@ Jing Hotel</h2>
            </div>
        </div>
        <div class="about-text">
            123
        </div>
    </div>
</template>
<style scoped lang="scss">
@import "../assets/style.scss";
.container {
    width: 100%;

    .kv {
        width: 100%;
        height: calc(100vh - 60px);
        position: relative;
        margin-bottom: 2rem;

        .kvList {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            transition: all .5s;

            &.small {
                width: 1000px;
                height: 500px;
            }
            li {
                width: 100%;
                height: 100%;
                position: absolute;
                opacity: 0;

                &.animate {
                    animation-name: kvAnimate;
                    animation-timing-function:  linear;
                }
            }
        }
        .text {
            width: 100%;
            position: absolute; 
            bottom: 50px;
            color: #8a7d3c;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            opacity: 0;
            transition: all .3s;

            &.show {
                opacity: 1;
            }

            h2 {
                font-size: 2rem;
            }
            
        }
    }
    .about-text {
        width: 100%;
        height: 100vh;
    }
}


@keyframes kvAnimate{
    0%{
        opacity: 0;
        background-size: 150% auto;
    }
    25%{
        opacity: 1;
    }
    50%{
        opacity: 1;
    }
    75%{
        opacity: 0;
    }
    100%{
        opacity: 0;
        background-size: 120% auto;
    }
}
</style>
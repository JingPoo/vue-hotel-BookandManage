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
            <div class="scrollhint" v-show="!scroll">
                <span>scroll</span>
                <i class="fa-solid fa-arrow-down-long fa-bounce"></i>
            </div>
        </div>
        <div class="about-text">
            <p>Jing Hotel 設立於2023年，以顧客至上為理念，致力打造台灣第一飯店品牌。</p>
            <p>我們提供多種房型供旅客選擇，另設有私人游泳池、SPA按摩蒸氣室、健身房及各式運動球場供住宿旅客免費使用，希望來到飯店的旅客可以暫時放下煩惱盡情遊玩。</p>
            <h2>飯店資訊</h2>
            <p>電話: (02)-12345678</p>
            <p>傳真: (02)-87654321</p>
            <p>信箱: jingh861219@gmail.com</p>
            <p>地址: 100台北市中正區濟南路一段71號</p>
        </div>
        <div class="map">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.753856227227!2d121.52144034355045!3d25.04242603635274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442a970c3aeb69b%3A0x44ce90483d0f17ec!2z5Y-w5YyX5biC56uL5oiQ5Yqf6auY57Sa5Lit5a24!5e0!3m2!1szh-TW!2stw!4v1690821073441!5m2!1szh-TW!2stw" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import "../assets/style.scss";
.container {
    width: 100vw;
    
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
                width: 400px;
                height: 200px;

                @include md {
                    width: 500px;
                    height: 250px;
                }
                @include lg {
                    width: 700px;
                    height: 350px;
                }
                @include xl {
                    width: 900px;
                    height: 450px;
                }
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
        .scrollhint {
            position: absolute;
            right: 30px;
            bottom: 10px;
            font-size: 1.4rem;

            @include md {
                font-size: 1.8rem;
            }
        }
    }
    .about-text {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 2rem;

        p {
            font-size: 1.2rem;
        }
        h2 {
            margin-top: 6rem;
        }
    }
    .map {
        width: 100%;
        height: 400px;
        margin-top: 2rem;

        iframe {
            width: 100%;
            height: 100%;
        }
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
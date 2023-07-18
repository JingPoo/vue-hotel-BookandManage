<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')

const store = useStore()
const router = useRouter()
const error = ref(null) 

const submitHandler = async () => {
    try {
        await store.dispatch('login', { 
            email: email.value, 
            password: password.value 
        })
        router.push('/')
    } catch (err) {
        error.value = err.message
        alert(error.value)
    }
}
</script>
<template>
    <div>
        <form @submit.prevent="submitHandler">
            <h3 class="text-xl font-bold">會員登入</h3>

            <label for="email">Email:</label>
            <input type="email" name="email" v-model.trim="email" required>

            <label for="password">Password:</label>
            <input type="password" name="password" v-model.trim="password" required>

            <button>Log in</button>
        </form>
        <div class="test">
            <h3>Test User:</h3>
            <h4>Email: test@gmail.com</h4>
            <h4>Password: 123456</h4>
            <h3>Admin:</h3>
            <h4>Email: admin@gmail.com</h4>
            <h4>Password: admin123</h4>
        </div>
    </div>
</template>
<style scoped lang="scss">
@import "../assets/style.scss";
form {
    width: 20rem;
    margin: 0 auto;
    margin-top: 4rem;
    border: 1px solid black;
    box-shadow: 0px 0px 5px darkgray;
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    h3 {
        font-size: 2rem;
        font-weight: bold;
    }
    label {
        font-size: 1.4rem;
    }
    input {
        outline: none;
        font-size: 1.2rem;
    }
    button {
        font-size: 1.2rem;
        color: white;
        background-color: $info;
        border-radius: 5px;
        padding: .4rem .4rem;
        cursor: pointer;

        &:hover {
            opacity: .8;
        }
    }
}
.test {
    color: gray;
    text-align: center;
    margin-top: 2rem;
}
</style>
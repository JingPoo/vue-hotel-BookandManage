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
        await store.dispatch('signup', { 
            email: email.value, 
            password: password.value 
        })
        router.push('/')
    } catch (err) {
        error.value = err.message
    }
}
</script>
<template>
    <form @submit.prevent="submitHandler">
        <h3>註冊會員</h3>

        <label for="email">Email:</label>
        <input  type="email" name="email" v-model="email" required>

        <label for="password">Password:</label>
        <input  type="password" name="password" v-model="password" required>

        <button>Sign up</button>
        <div v-if="error">{{ error }}</div>
    </form>
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
</style>
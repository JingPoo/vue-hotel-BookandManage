import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyDoVEjM4EC0tED-z9U9NpNsmMho_t91Pe0",
    authDomain: "vuex-for-hotel.firebaseapp.com",
    projectId: "vuex-for-hotel",
    storageBucket: "vuex-for-hotel.appspot.com",
    messagingSenderId: "454532608041",
    appId: "1:454532608041:web:b8056ee3f08fb10baa2c38"
  };

// init firebase
initializeApp(firebaseConfig)

// init firebase auth
const auth = getAuth()

export { auth }
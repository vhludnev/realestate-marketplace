import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "latinazara.firebaseapp.com",
  databaseURL: "https://latinazara.firebaseio.com",
  projectId: "latinazara",
  storageBucket: "latinazara.appspot.com",
  messagingSenderId: "952309631402",
  appId: "1:952309631402:web:3e7f32124701c6fe5f83d3"
}

// Initialize Firebase
/* const app =  */initializeApp(firebaseConfig)

export const db = getFirestore()
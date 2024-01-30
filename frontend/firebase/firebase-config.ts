// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOInXeAmYB-z72dMMvwyr4DkGxCwVhpXc",
  authDomain: "dg-travelohi.firebaseapp.com",
  projectId: "dg-travelohi",
  storageBucket: "dg-travelohi.appspot.com",
  messagingSenderId: "295832612285",
  appId: "1:295832612285:web:ac40f169f6fce54b9636d4",
  measurementId: "G-6MSBZW8GSC"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage()
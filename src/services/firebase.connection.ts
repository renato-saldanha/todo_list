// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5fqf_8Q_hhZkWXile6fawyBhfkH9G7rY",
  authDomain: "todolist-4aef3.firebaseapp.com",
  projectId: "todolist-4aef3",
  storageBucket: "todolist-4aef3.appspot.com",
  messagingSenderId: "158663084057",
  appId: "1:158663084057:web:2645ab7b18d9ce07f00288",
  measurementId: "G-EPJSB5P14Y"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export {db};
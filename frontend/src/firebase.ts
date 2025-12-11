import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCD2w6GU_DAnXPre1LYkk1k-79UIf6A1wM",
  authDomain: "myproductapp-1b535.firebaseapp.com",
  projectId: "myproductapp-1b535",
  storageBucket: "myproductapp-1b535.firebasestorage.app",
  messagingSenderId: "728333405134",
  appId: "1:728333405134:web:4e58be5aedd977e313399f",
  measurementId: "G-WBD3GQJ8ZY"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
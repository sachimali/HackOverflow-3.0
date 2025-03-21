import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  //Firebase Credentials
  apiKey: "AIzaSyDwfg3giN0dzP0KQMBNqa_WMikGTZKYwCo",
  authDomain: "ecowise-1e516.firebaseapp.com",
  projectId: "ecowise-1e516",
  storageBucket: "ecowise-1e516.firebasestorage.app",
  messagingSenderId: "85722876294",
  appId: "1:85722876294:web:3d867ce2b2399f84c28407",
  measurementId: "G-YBJQRMTJEE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db };

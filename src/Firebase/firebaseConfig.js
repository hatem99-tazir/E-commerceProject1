
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import { browserLocalPersistence, getAuth, GoogleAuthProvider, setPersistence, signInWithPopup } from 'firebase/auth';

import { getDatabase } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCeGFI-KraJOYXszC9UgqEh6AlP3v5SPOI",
  authDomain: "e-commerceproject1-84d82.firebaseapp.com",
  databaseURL: "https://e-commerceproject1-84d82-default-rtdb.firebaseio.com",
  projectId: "e-commerceproject1-84d82",
  storageBucket: "e-commerceproject1-84d82.appspot.com",
  messagingSenderId: "265035890640",
  appId: "1:265035890640:web:75fe2f557ea23dd58243d5",
  measurementId: "G-YS8BYN5RTV"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app); 
const auth = getAuth(app);


setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to local");
  })
  .catch((error) => {
    console.error("Failed to set persistence:", error);
  });


export { auth, database , GoogleAuthProvider, signInWithPopup};
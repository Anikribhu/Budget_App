import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCS7xb0W5ad4R8bjQSrV6iF3gJMosxmrjY",
    authDomain: "budget-app-f485a.firebaseapp.com",
    projectId: "budget-app-f485a",
    storageBucket: "budget-app-f485a.appspot.com",
    messagingSenderId: "1094707234937",
    appId: "1:1094707234937:web:d4805019502219f9916ca8"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
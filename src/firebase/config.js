import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0ruKQeiMcQle37cvgKzvKzyMwQA48PBc",
  authDomain: "mymoney-a0e03.firebaseapp.com",
  projectId: "mymoney-a0e03",
  storageBucket: "mymoney-a0e03.appspot.com",
  messagingSenderId: "81653925866",
  appId: "1:81653925866:web:1025201096910ab121d493",
};

// init firebase
firebase.initializeApp(firebaseConfig);

// init services
const projectFirestore = firebase.firestore();
const projectAuth = firebase.auth();

//firebaseTimestamp
const timestamp = firebase.firestore.Timestamp;
//when we invoke timestamp fn in the future, then is going to create a timestamp data property,a special type of data property used in finance databases because we don't just send through a date object.

export { projectFirestore, projectAuth, timestamp };

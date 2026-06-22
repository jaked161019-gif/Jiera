export const firebaseConfig = {
  apiKey: "AIzaSyCj_4x8Yuql0U2OCEx6eHK_KAd8mJjqoL4",
  authDomain: "jiera1.firebaseapp.com",
  projectId: "jiera1",
  storageBucket: "jiera1.firebasestorage.app",
  messagingSenderId: "673366321859",
  appId: "1:673366321859:web:35b3d4adf947e109249076",
  measurementId: "G-F0GXDYCLC4"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();


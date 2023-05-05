import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import store from "./Redux/store";
import App from "./App";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB6iO3gqlOODFK97h8BSwuSXN4dxf8R44o",
  authDomain: "network-automation-d31c2.firebaseapp.com",
  projectId: "network-automation-d31c2",
  storageBucket: "network-automation-d31c2.appspot.com",
  messagingSenderId: "538750354083",
  appId: "1:538750354083:web:86cebe6c4e4a80b891f516",
  measurementId: "G-NGK00Z08FY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);



const root = createRoot(document.getElementById("root"));

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);


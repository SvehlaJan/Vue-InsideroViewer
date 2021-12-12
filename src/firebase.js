// import * as firebase from 'firebase/app'
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

// firebase init
const firebaseConfig = {
  apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
  authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VUE_APP_FIREBASE_APP_ID,
  measurementId: process.env.VUE_APP_FIREBASE_MEASUREMENT_ID,
};
firebase.initializeApp(firebaseConfig);

// utils
const db = firebase.firestore();
const auth = firebase.auth();
const authNamespace = firebase.auth;

// collection references
const usersCollection = db.collection("users");

function usersOfferHistory(userId) {
  return usersCollection.doc(userId).collection("offersHistory");
}

function usersSavedLocations(userId) {
  return usersCollection.doc(userId).collection("savedLocations");
}

async function getUsersOfferHistory(userId) {
  const querySnapshot = await usersOfferHistory(userId).get();
  const offersHistory = new Map();
  querySnapshot.forEach((doc) => {
    offersHistory.set(doc.id, doc.data());
  });
  return offersHistory;
}


async function getUsersSavedLocations(userId) {
  const querySnapshot = await usersSavedLocations(userId).get();
  const savedLocations = new Map();
  querySnapshot.forEach((doc) => {
    savedLocations.set(doc.id, doc.data());
  });
  return savedLocations;
}

async function deleteUsersSavedLocation(userId, locationId) {
  await usersSavedLocations(userId).doc(locationId).delete();
}


// export utils/refs
export {
  db,
  auth,
  authNamespace,
  usersCollection,
  usersOfferHistory,
  getUsersOfferHistory,
  usersSavedLocations,
  getUsersSavedLocations,
  deleteUsersSavedLocation,
};

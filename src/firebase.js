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

function currentUsersDoc() {
  return db.collection("users").doc(auth.currentUser.uid);
}

function usersOfferHistory() {
  return currentUsersDoc().collection("offersHistory");
}

function usersSavedLocations() {
  return currentUsersDoc().collection("savedLocations");
}

function usersBrowsingHistory() {
  return currentUsersDoc().collection("browsingHistory");
}

async function getUsersOfferHistory() {
  const querySnapshot = await usersOfferHistory().get();
  const offersHistory = new Map();
  querySnapshot.forEach((doc) => {
    offersHistory.set(doc.id, doc.data());
  });
  return offersHistory;
}


async function getUsersSavedLocations() {
  const querySnapshot = await usersSavedLocations().get();
  const savedLocations = new Map();
  querySnapshot.forEach((doc) => {
    savedLocations.set(doc.id, doc.data());
  });
  return savedLocations;
}

async function getUsersBrowsingHistory() {
  const querySnapshot = await usersBrowsingHistory().get();
  const browsingHistory = new Map();
  querySnapshot.forEach((doc) => {
    browsingHistory.set(doc.id, doc.data());
  });
  return browsingHistory;
}

async function deleteUsersSavedLocation(locationId) {
  await usersSavedLocations().doc(locationId).delete();
}


// export utils/refs
export {
  db,
  auth,
  authNamespace,
  currentUsersDoc,
  usersOfferHistory,
  getUsersOfferHistory,
  usersSavedLocations,
  getUsersSavedLocations,
  deleteUsersSavedLocation,
  usersBrowsingHistory,
  getUsersBrowsingHistory,
};

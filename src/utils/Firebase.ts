import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: `${import.meta.env.VITE_APP_NAME}.firebaseapp.com`,
  projectId: `${import.meta.env.VITE_APP_NAME}`,
  storageBucket: `${import.meta.env.VITE_APP_NAME}.appspot.com`,
  messagingSenderId: `102784253914`,
  appId: `1:102784253914:web:5356b06a3ca8bb6bf24ae3`,
  value: `https://${
    import.meta.env.VITE_APP_NAME
  }-default-rtdb.firebaseio.com/`,
};

export default class Firebase {
  static App = initializeApp(firebaseConfig);
  static Database = getDatabase(this.App);
}

export const STICKERS_DB = `stickers${!import.meta.env.PROD ? `-dev` : ``}`;

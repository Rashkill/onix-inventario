import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBkGP0SVxY6epLtuooTSsqR0FqArNgb7fY",
  authDomain: "onix-inv.firebaseapp.com",
  projectId: "onix-inv",
  storageBucket: "onix-inv.appspot.com",
  messagingSenderId: "102784253914",
  appId: "1:102784253914:web:5356b06a3ca8bb6bf24ae3",
  value: "https://onix-inv-default-rtdb.firebaseio.com/",
};

export default class Firebase {
  static App = initializeApp(firebaseConfig);
  static Database = getDatabase(this.App);
}

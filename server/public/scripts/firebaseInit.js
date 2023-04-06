import { firebaseConfig } from './../config/config.js';

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth(app);
const firestore = firebase.firestore(app);
const storage = firebase.storage(app);

export { auth, app, firestore, storage };

// import { initializeApp } from 'firebase/app';
// import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { initializeApp } from 'https://cdn.skypack.dev/@firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'https://cdn.skypack.dev/@firebase/auth';
import { getStorage } from 'https://cdn.skypack.dev/@firebase/storage';
import {
  getFirestore,
  collection,
  addDoc,
} from 'https://cdn.skypack.dev/@firebase/firestore';

import { firebaseConfig } from './../config/config.js';

const apiKey = '6ee2887d8ef0af49a956931ffac86c0b';

// Your web app's Firebase configuration
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// const db = getFirestore(app);
// const storage = getStorage(app);

const useAuthentication = () => {
  const authOptions = {
    signIn: 1,
    signUp: 2,
    sendPasswordResetEmail: 3,
  };

  const displayErrorMessage = (errorMessage) => {
    // Display the error message on the page
    const errorMessageElement = document.getElementById('error-message');
    errorMessageElement.innerText = errorMessage;
    errorMessageElement.classList.remove('d-none');
  };

  const handleAuthentication = async (email, password, option) => {
    let user = null;

    try {
      if (option === authOptions.signIn) {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = userCredential.user;
        // Store the user's ID token in local storage
        localStorage.setItem('idToken', user.qa);
      } else if (option === authOptions.signUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = userCredential.user;
      } else if (option === authOptions.sendPasswordResetEmail) {
        await sendPasswordResetEmail(auth, email);
        setUserMessage('Password reset email sent!');
      }
    } catch (error) {
      errorHandler(error, (errorMessage) => {
        // Display the error message on the page
        const errorMessageElement = document.getElementById('error-message');
        errorMessageElement.innerText = errorMessage;
        errorMessageElement.classList.remove('d-none');
      });
    }

    return user;
  };

  const saveUserProfile = async (
    user,
    firstName,
    lastName,
    age,
    occupation,
    dateOfBirth,
    profilePicture
  ) => {
    try {
      // Save profile data to Firestore
      const profileData = {
        uid: user.uid,
        firstName,
        lastName,
        age,
        occupation,
        dateOfBirth,
      };
      await addDoc(collection(firestore, 'users'), profileData);

      // Save profile picture to Firebase Storage
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      await put(storageRef, profilePicture);

      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  };

  async function createUserProfile(
    user,
    firstName,
    lastName,
    age,
    occupation,
    dateOfBirth,
    profilePicture
  ) {
    // Save user profile data to Firestore
    try {
      await db.collection('users').doc(user.uid).set({
        firstName,
        lastName,
        age,
        occupation,
        dateOfBirth,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Store the profile picture in Firebase Storage
      if (profilePicture) {
        const storageRef = storage.ref();
        const profilePictureRef = storageRef.child(
          `profile-pictures/${user.uid}/${profilePicture.name}`
        );
        await profilePictureRef.put(profilePicture);

        // Update user's profile picture URL in Firestore
        const profilePictureURL = await profilePictureRef.getDownloadURL();
        await db.collection('users').doc(user.uid).update({
          profilePictureURL,
        });
      }
      return true;
    } catch (error) {
      console.error('Error creating user profile:', error);
      return false;
    }
  }

  return {
    firebaseConfig,
    authOptions,
    displayErrorMessage,
    handleAuthentication,
    createUserProfile,
    saveUserProfile,
  };
};

function errorHandler(error, displayError) {
  const errorMap = {
    'auth/weak-password': 'The password is too weak.',
    'auth/wrong-password':
      'The password is invalid or the user does not have a password.',
    'auth/user-not-found':
      'There is no user record corresponding to this e-mail.',
    'auth/email-already-in-use':
      'The email address is already in use by another account.',
    'auth/invalid-email': 'The email address is badly formatted.',
    'auth/too-many-requests': 'Too many requests. Try again later.',
  };
  const errorMessage = errorMap[error.code] || error.message;

  // Call the displayError function passed as a callback
  displayError(errorMessage);
}

export default useAuthentication;

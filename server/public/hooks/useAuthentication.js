import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'https://cdn.skypack.dev/@firebase/auth';

import { firebaseConfig } from './../config/config.js';

const useAuthentication = (auth) => {
  const authOptions = {
    signIn: 1,
    signUp: 2,
    sendPasswordResetEmail: 3,
    signInAnonymously: 4,
  };

  const displayMessage = (message, type) => {
    // Display the error message on the page
    const messageElement = document.getElementById('message');
    messageElement.classList.add(`alert-${type}`);
    messageElement.innerText = message;
    messageElement.classList.remove('d-none');
  };

  const handleAuthentication = async (email, password, option) => {
    let user = null;

    try {
      if (option === authOptions.signIn) {
        // Get the user credential with Recaptcha verification
        const credential = firebase.auth.EmailAuthProvider.credential(email, password);
        const userCredential = await auth.signInWithCredential(credential, window.recaptchaVerifier);
        user = userCredential.user;
      
        // Store the user's ID token in local storage
        localStorage.setItem('user', JSON.stringify(user));
      } else if (option === authOptions.signInAnonymously) {
        const userCredential = await auth.signInAnonymously();
        user = userCredential.user;
        localStorage.setItem('user', JSON.stringify(user));
      } else if (option === authOptions.signUp) {
        const userCredential = await auth.createUserWithEmailAndPassword(
          email,
          password
        );
        user = userCredential.user;
  
        // Store the user's ID token in local storage
        localStorage.setItem('user', JSON.stringify(user));
      } else if (option === authOptions.sendPasswordResetEmail) {
        await sendPasswordResetEmail(auth, email);
        setUserMessage('Password reset email sent!');
      }
    } catch (error) {
      errorHandler(error, (errorMessage) => {
        console.error(error);
        // Display the error message on the page
        const errorMessageElement = document.getElementById('message');
        errorMessageElement.innerText = errorMessage;
        errorMessageElement.classList.remove('d-none');
      });
    }

    return user;
  };

  return {
    firebaseConfig,
    authOptions,
    displayMessage: displayMessage,
    handleAuthentication,
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

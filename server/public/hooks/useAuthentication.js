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
        localStorage.setItem('user', JSON.stringify(user));
      } else if (option === authOptions.signUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        user = userCredential.user;
        // Store the user's ID token in local storage
        localStorage.setItem('idToken', user.qa);
        localStorage.setItem('user', JSON.stringify(user));
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

  return {
    firebaseConfig,
    authOptions,
    displayErrorMessage,
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

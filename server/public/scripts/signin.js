import { auth } from './firebaseInit.js';
import useAuthentication from '../hooks/useAuthentication.js';

const authHook = useAuthentication(auth);

$(document).ready(() => {
  initRecaptcha();

  $('form').submit((e) => {
    e.preventDefault();

    const email = $('#inputEmail').val();
    const password = $('#inputPassword').val();

    authHook
      .handleAuthentication(email, password, authHook.authOptions.signIn)
      .then((user) => {
        if (user) {
          window.location.href = '/pages/home.html';
        }
      });
  });

  const anonymousSigninBtn = document.getElementById('anonymous-signin-btn');
  anonymousSigninBtn.addEventListener('click', () => {
    authHook
      .handleAuthentication(null, null, authHook.authOptions.signInAnonymously)
      .then((user) => {
        if (user) {
          window.location.href = '/pages/home.html';
        }
      })
      .catch((error) => {
        console.error(error);
      });
  });
});

function initRecaptcha() {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': (response) => {
      console.log('Recaptcha resolved');
    },
    'expired-callback': () => {
      console.log('Recaptcha expired');
    }
  });
}

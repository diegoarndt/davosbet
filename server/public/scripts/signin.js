import { auth } from './firebaseInit.js';
import useAuthentication from '../hooks/useAuthentication.js';

const authHook = useAuthentication(auth);

$(document).ready(() => {
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
});

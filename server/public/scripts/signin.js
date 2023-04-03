import useAuthentication from '../hooks/useAuthentication.js';

const auth = useAuthentication();

$(document).ready(() => {
  $('form').submit((e) => {
    e.preventDefault();

    const email = $('#inputEmail').val();
    const password = $('#inputPassword').val();

    auth
      .handleAuthentication(email, password, auth.authOptions.signIn)
      .then((user) => {
        if (user) {
          window.location.href = '/pages/home.html';
        }
      });
  });
});

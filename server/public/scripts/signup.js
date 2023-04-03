import useAuthentication from '../hooks/useAuthentication.js';

const auth = useAuthentication();

$(document).ready(() => {
  $('form').submit(async (e) => {
    e.preventDefault();

    // Retrieve form inputs
    const firstName = $('#inputFirstName').val();
    const lastName = $('#inputLastName').val();
    const age = $('#inputAge').val();
    const occupation = $('#inputOccupation').val();
    const dateOfBirth = $('#inputDateOfBirth').val();
    const email = $('#inputEmail').val();
    const password = $('#inputPassword').val();
    const confirmPassword = $('#inputConfirmPassword').val();
    const profilePicture = document.getElementById('inputProfilePicture')
      .files[0];

    if (password !== confirmPassword) {
      // Display error message for non-matching passwords
      auth.displayErrorMessage('Passwords do not match.');
      return;
    }

    // Sign up user
    const profileCreated = await auth.createUserProfile(
      `${firstName}${lastName}${age}}`,
      firstName,
      lastName,
      age,
      occupation,
      dateOfBirth,
      profilePicture
    );
    if (profileCreated) {
      window.location.href = '/pages/home.html';
    } else {
      // Display an error message to the user
      auth.displayErrorMessage('Error creating user profile.');
    }
  });
});

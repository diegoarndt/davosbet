import { auth, firestore, storage } from './firebaseInit.js';
import useAuthentication from '../hooks/useAuthentication.js';

const authHook = useAuthentication(auth);

const uploadProfilePicture = async (file, uid) => {
  const storageRef = storage.ref();
  const profilePictureRef = storageRef.child(`profilePictures/${uid}`);

  const snapshot = await profilePictureRef.put(file);
  const downloadURL = await snapshot.ref.getDownloadURL();

  return downloadURL;
};

$(document).ready(() => {
  // Get the current user and populate the form
  const currentUser = auth.currentUser;

  $('#inputFirstName').val(currentUser.displayName.split(' ')[0]);
  $('#inputLastName').val(currentUser.displayName.split(' ')[1]);
  $('#inputAge').val(21); // TODO: Retrieve from Firestore
  $('#inputOccupation').val('Student'); // TODO: Retrieve from Firestore
  $('#inputDateOfBirth').val('2000-01-01'); // TODO: Retrieve from Firestore
  $('#inputEmail').val(currentUser.email);

  const profilePictureURL = currentUser.photoURL;
  if (profilePictureURL) {
    $('#profilePicture').attr('src', profilePictureURL);
  }

  $('form').submit(async (e) => {
    e.preventDefault();

    const firstName = $('#inputFirstName').val();
    const lastName = $('#inputLastName').val();
    const age = $('#inputAge').val();
    const occupation = $('#inputOccupation').val();
    const dateOfBirth = $('#inputDateOfBirth').val();
    const email = $('#inputEmail').val();

    try {
      // Update the display name
      const displayName = `${firstName} ${lastName}`;
      await auth.currentUser.updateProfile({ displayName: displayName });

      // Upload the profile picture and get its URL
      const profilePictureFile = $('#inputProfilePicture').get(0).files[0];

      let profilePictureURL = '';
      if (profilePictureFile) {
        profilePictureURL = await uploadProfilePicture(
          profilePictureFile,
          auth.currentUser.uid
        );
        await auth.currentUser.updateProfile({ photoURL: profilePictureURL });
      }

      // Update the user information in Firestore
      const userDoc = await firestore
        .collection('users')
        .doc(auth.currentUser.uid)
        .get();
      await userDoc.ref.update({
        firstName: firstName,
        lastName: lastName,
        age: age,
        occupation: occupation,
        dateOfBirth: dateOfBirth,
        email: email,
        profilePictureURL: profilePictureURL,
      });

      authHook.displaySuccessMessage('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      authHook.displayErrorMessage('Error updating profile');
    }
  });
});

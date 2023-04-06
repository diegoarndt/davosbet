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

$(document).ready(async () => {
  // Get the current user and populate the form
  const localUser = JSON.parse(localStorage.getItem('user'));
  const uid = localUser.uid;
  const userCollection = firestore.collection('users');

  const userDoc = await firestore
    .collection('users')
    .where('uid', '==', uid)
    .get();

  if (userDoc.empty) {
    console.log('User not found');
  }

  $('#inputProfilePicture').on('change', function () {
    const fileName = $(this).get(0).files[0]?.name || 'Choose file';
    $(this).next('.custom-file-label').text(fileName);
  });

  const getUserInfo = () => {
    $('#inputFirstName').val(localUser.displayName.split(' ')[0]);
    $('#inputLastName').val(localUser.displayName.split(' ')[1]);
    $('#inputEmail').val(localUser.email);

    userCollection
      .doc(userDoc.docs[0]?.id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const data = doc.data();
          $('#inputAge').val(data.age);
          $('#inputAgeValue').text(data.age);
          $('#inputOccupation').val(data.occupation);
          $('#inputDateOfBirth').val(data.dateOfBirth);
        }
      })
      .catch((error) => {
        console.error('Error getting user information from Firestore:', error);
      });

    // Get the profile picture URL and display it
    const storageRef = storage.ref();
    const profilePictureRef = storageRef.child(
      `profilePictures/${localUser.uid}`
    );
    profilePictureRef
      .getDownloadURL()
      .then((url) => {
        $('#profilePicture').attr('src', url);
      })
      .catch((error) => {
        console.error(
          'Error getting profile picture or the user has not defined it yet:',
          error
        );
      });
  };

  getUserInfo();

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
      userCollection.doc(userDoc.docs[0]?.id).update({
        firstName: firstName,
        lastName: lastName,
        age: age,
        occupation: occupation,
        dateOfBirth: dateOfBirth,
        email: email,
        profilePictureURL: profilePictureURL,
      });
      authHook.displayMessage('Profile updated successfully', 'success');
      getUserInfo();
    } catch (error) {
      console.error('Error updating profile:', error);
      authHook.displayMessage('Error updating profile', 'danger');
    }
  });
});

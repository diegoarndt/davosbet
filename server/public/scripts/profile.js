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
  const currentUser = auth.currentUser;
  const localUser = JSON.parse(localStorage.getItem('user'));
  const uid = localUser.uid;

  const userDoc = await firestore
    .collection('users')
    .where('uid', '==', uid)
    .get();
  if (userDoc.empty) {
    console.log('User not found');
  }

  $('#inputFirstName').val(currentUser.displayName.split(' ')[0]);
  $('#inputLastName').val(currentUser.displayName.split(' ')[1]);
  $('#inputEmail').val(currentUser.email);

  const userCollection = firestore.collection('users');
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
    `profilePictures/${currentUser.uid}`
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

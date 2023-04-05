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
  $('form').submit(async (e) => {
    e.preventDefault();

    const firstName = $('#inputFirstName').val();
    const lastName = $('#inputLastName').val();
    const age = $('#inputAge').val();
    const occupation = $('#inputOccupation').val();
    const dateOfBirth = $('#inputDateOfBirth').val();
    const email = $('#inputEmail').val();
    const password = $('#inputPassword').val();
    const confirmPassword = $('#inputConfirmPassword').val();

    if (password !== confirmPassword) {
      authHook.displayErrorMessage('Passwords do not match');
      return;
    }

    try {
      const user = await authHook.handleAuthentication(
        email,
        password,
        authHook.authOptions.signUp
      );

      if (user) {
        // Set the display name
        const displayName = `${firstName} ${lastName}`;
        await auth.currentUser.updateProfile({ displayName: displayName });

        // Upload the profile picture and get its URL
        const profilePictureFile = $('#inputProfilePicture').get(0).files[0];

        let profilePictureURL = '';
        if (profilePictureFile) {
          profilePictureURL = await uploadProfilePicture(
            profilePictureFile,
            user.uid
          );
        }

        function generateId(length) {
          let result = '';
          const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
          const charactersLength = characters.length;
          for (let i = 0; i < length; i++) {
            result += characters.charAt(
              Math.floor(Math.random() * charactersLength)
            );
          }
          return result;
        }

        // Add user information to Firestore
        const userCollection = firestore.collection('users');
        const shortId = generateId(6); // Generate a 6-character ID
        await userCollection.doc(shortId).set({
          uid: user.uid,
          firstName: firstName,
          lastName: lastName,
          age: age,
          occupation: occupation,
          dateOfBirth: dateOfBirth,
          email: email,
          profilePictureURL: profilePictureURL,
        });

        window.location.href = '/pages/home.html';
      }
    } catch (error) {
      console.error('Error during sign-up:', error);
    }
  });
});

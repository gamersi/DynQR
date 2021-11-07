// import firebase from 'firebase/app';
// import 'firebase/messaging';

// const messaging = firebase.messaging();

// try {
//     firebase.initializeApp({
//         apiKey: 'AIzaSyCRJNpLOTC1CMgyOeTarZ42hFuxb_X-Skw',
//         authDomain: 'dynqr-admin-id.firebaseapp.com',
//         projectId: 'dynqr-admin-id',
//         storageBucket: 'dynqr-admin-id.appspot.com',
//         messagingSenderId: '400113144848',
//         appId: '1:400113144848:web:d612d8b739a350fb39e695',
//         measurementId: 'G-KNQE3TDF0C'
//     });
// } catch (e) {
//     console.log(`Already inited(${e})`);
// }

// messaging.onBackgroundMessage(function(payload) {
//     console.log('Received background message ', payload);
  
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//       body: payload.notification.body,
//     };
  
//     this.registration.showNotification(
//         notificationTitle,
//         notificationOptions
//     );
//   });

// export const getToken = (setTokenFound) => {
//     return messaging.getToken({vapidKey: 'GENERATED_MESSAGING_KEY'}).then((currentToken) => {
//       if (currentToken) {
//         console.log('current token for client: ', currentToken);
//         setTokenFound(true);
//         // Track the token -> client mapping, by sending to backend server
//         // show on the UI that permission is secured
//       } else {
//         console.log('No registration token available. Request permission to generate one.');
//         setTokenFound(false);
//         // shows on the UI that permission is required 
//       }
//     }).catch((err) => {
//       console.log('An error occurred while retrieving token. ', err);
//       // catch error while creating client token
//     });
//   }
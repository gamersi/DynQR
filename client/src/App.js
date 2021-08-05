// eslint-disable-next-line
import React, { useRef, useState } from 'react';
import usericon from './assets/usericon.svg';
import logo from './assets/logo.svg';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import QRcode from 'qrcode.react'

import { useAuthState } from 'react-firebase-hooks/auth';
// eslint-disable-next-line
import { useCollectionData } from 'react-firebase-hooks/firestore';
import axios from 'axios';

// Initialize Firebase
firebase.initializeApp({
  apiKey: "AIzaSyCRJNpLOTC1CMgyOeTarZ42hFuxb_X-Skw",
  authDomain: "dynqr-admin-id.firebaseapp.com",
  projectId: "dynqr-admin-id",
  storageBucket: "dynqr-admin-id.appspot.com",
  messagingSenderId: "400113144848",
  appId: "1:400113144848:web:d612d8b739a350fb39e695",
  measurementId: "G-KNQE3TDF0C"
});

const auth = firebase.auth();

// const url = "http://localhost:3000"
const urlbackend = "http://localhost"

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <section>
        {user ? <Home /> : <NotSignedIn />}
      </section>
    </div>
  );
}

function NotSignedIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((response) => {
    }).catch((rejected) => {
      if(rejected.code === "auth/user-disabled"){
        alert('Du bist gebannt!');
      }else{
        alert('Fehler(Sonstige/' + rejected.code + ')!');
      }
    }); 
  }
  return (
    <div className="signIn">
        <img src={logo} className="logo" alt="logo" />
        <img src={usericon} className="usericon-lkd" alt="usericon" />
        <div className="panel">
          <button className="loginBtn" onClick={signInWithGoogle}>Login</button>
        </div>
    </div>
  );
}

function Home(){
  const [qr, setQr] = useState('https://www.youtube.com/watch?v=oHg5SJYRHA0');
  let menu = null;
  const togglePopup = () => {
    menu = document.getElementById('accmenu');
    if(menu.style.display === 'none'){
      menu.style.display = 'flex';
    }else{
      menu.style.display = 'none';
    }
  }

  function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  const genQRCode = () => {
    const input = document.getElementsByClassName('urlInput')[0];
    const agreement = document.getElementsByClassName('checkBoxAgreement')[0];
    const agreement2 = document.getElementsByClassName('agreementText')[0];
    const submit = document.getElementsByClassName('submit')[0];
    const uniqueID = UUID();
    setQr(urlbackend + '/func/redir/' + uniqueID)
    var isUrl = false;
    if(validURL(input.value)){
      isUrl = true;
      console.log('Valid URL')
    }
    axios.post(urlbackend + '/api/addQrCode', {
      userID: auth.currentUser.uid,//data
      url: input.value,
      uuid: uniqueID,
      username: auth.currentUser.displayName,
      isUrl: isUrl
    }).then((response) => {
      console.log(response)
      // eslint-disable-next-line
      if(response.status != 200){
        alert(`FEHLER(${response.status})`)
      }else{
        submit.textContent = "Download";
        submit.classList.remove('submit');
        submit.classList.add('download');
        agreement.remove();
        agreement2.remove();
        input.remove();
      }
    }).catch((err) => {
      console.log(err)
      alert('FEHLER:' + err)
    })
  }
  document.addEventListener('load', () => {
    document.getElementsByClassName('submit')[0].addEventListener('click', genQRCode)
  })
  return (
    <div className="signedIn">
        <img src={logo} className="logo" alt="logo" />
        <img src={auth.currentUser.photoURL || usericon} onClick={togglePopup} className="usericon" alt="usericon" />
        <div id="accmenu">
          <button id="dashboardBtn">Dashboard</button>
          <button id="logoutBtn" onClick={() => auth.signOut()}>Log out</button>
        </div>
        <div className="panel">
          <h1 className="newQRText">Neuer QRCode</h1>
          <QRcode 
              className="QrCodePreview"
              value={qr} 
              size={280}
              includeMargin={false}
          />
          <input className="urlInput" type="text" placeholder="Text/URL"></input>
          <input type="checkbox"  className="checkBoxAgreement"></input> <label className="agreementText">Ich stimme den Datenschutzbestimmungen zu</label>
          <button className="submit" onClick={genQRCode}>QRCode erstellen</button>
        </div>
    </div>
  );
}

function UUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { 
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r && 0x3 | 0x8);
    return v.toString(16);
  });
}

export default App;

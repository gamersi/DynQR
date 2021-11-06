// eslint-disable-next-line
import React, { useRef, useState } from 'react';
import usericon from './assets/usericon.svg';
import logo from './assets/logo.svg';
import './App.css';

import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/analytics';
import QRcode, { displayName } from 'qrcode.react'

import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

try {
  firebase.initializeApp({
    apiKey: "AIzaSyCRJNpLOTC1CMgyOeTarZ42hFuxb_X-Skw",
    authDomain: "dynqr-admin-id.firebaseapp.com",
    projectId: "dynqr-admin-id",
    storageBucket: "dynqr-admin-id.appspot.com",
    messagingSenderId: "400113144848",
    appId: "1:400113144848:web:d612d8b739a350fb39e695",
    measurementId: "G-KNQE3TDF0C"
  });
} catch (e) {
  console.log(`Already inited(${e})`);
}


const auth = firebase.auth();

// const url = "http://localhost:3000"
const urlbackend = "http://localhost"

function App() {

  const [user, loading, error] = useAuthState(auth);
  const banned = localStorage.getItem('banned')

  return (
    <Router>
      {error ? <Error/> : 
      <div className="App">
      <Switch>
          <Route path="/dashboard">
            {loading ? null : (user ? <Dashboard /> : <NotSignedIn />)}
          </Route>⌈
          <Route path="/redirect">
            {loading ? null : (user ? <Dashboard /> : <NotSignedIn />)}
          </Route>
          <Route path="/">
            {loading ? null : (banned ? <Banned /> : (user ? <Home /> : <NotSignedIn />))}
          </Route>
        </Switch>
    </div>}
    </Router>
  );
}

function NotSignedIn(){
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).then((response) => {
      localStorage.setItem('uid', response.user.uid)
    }).catch((rejected) => {
      if(rejected.code === "auth/user-disabled"){
        alert('Du bist gebannt!');
        localStorage.setItem('banned', true)
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

function Banned(){
  const retry = () => {
    localStorage.removeItem('banned')
    window.location.reload()
  }
  return (
    <div className="Banned">
        <h1 className="white">Du bist gebannt!</h1>
        <div className="panel">
          <button className="loginBtn" onClick={retry}>Erneut Probieren</button>
        </div>
    </div>
  );
}

function Error(){
  return (
    <div className="Error">
        <h1 className="white">Unbekannter Fehler!</h1>
    </div>
  );
}

function Dashboard(){
  let menu = null;
  const togglePopup = () => {
    menu = document.getElementById('accmenu');
    if(menu.style.display === 'none'){
      menu.style.display = 'flex';
    }else{
      menu.style.display = 'none';
    }
  }
  const initPopup = () => {
    menu = document.getElementById('accmenu')
    menu.style.display = 'none'
  }

  const fetchData = async () => {
    axios.post(urlbackend + '/api/getqrcodes', {
      uid: auth.currentUser.uid,
    }).then((response) => {
      if(response.data.success === false){
        displayError(response.data.msg)
      }else{
        var data = response.data
        data[data.length-1] = null
        displayList(data)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const displayError = (err) => {
    const ul = document.getElementById('codelist')
    const parent = document.getElementById('list')
    const errText = document.createElement('h1')
    errText.innerHTML = err
    errText.className = 'white'
    errText.classList.add('error')
    parent.appendChild(errText)
    ul.remove()
  }

  const displayList = (list) => {
    const ul = document.getElementById('codelist')
    // const parent = document.getElementById('list')
    list.forEach((item) => {
      const li = document.createElement('li')
      const div = document.createElement('div')
      const name = document.createElement('h1')
      const deactivateBtn = document.createElement('button')
      const deleteBtn = document.createElement('button')
      const editBtn = document.createElement('button')
      name.innerHTML = item.url
      name.className = 'name'

      // deactivate button
      deactivateBtn.innerHTML = 'Deaktivieren'
      deactivateBtn.className = 'deactivateBtn'
      deactivateBtn.classList.add('btn-dash')
      deactivateBtn.setAttribute('data-url', item.url)
      deactivateBtn.setAttribute('data-uuid', item.uuid)
      deactivateBtn.addEventListener('click', () => {
        axios.post(urlbackend + '/api/deactivatecode', {
          uuid: item.uuid,
        }).then((response) => {
          if(response.data.success === false){
            displayError(response.data.msg)
          }else{
            alert("QRCode deaktiviert!")
          }
        }).catch((err) => {

        })
      })

      // delete button
      deleteBtn.innerHTML = 'Löschen'
      deleteBtn.className = 'deleteBtn'
      deleteBtn.classList.add('btn-dash')
      deleteBtn.setAttribute('data-url', item.url)
      deleteBtn.setAttribute('data-uuid', item.uuid)
      deleteBtn.addEventListener('click', () => {
        axios.post(urlbackend + '/api/deletecode', {
          uuid: item.uuid
        }).then((response) => {
          if(response.data.success === false){
            alert(response.data.msg)
          }else{
            alert("QRCode gelöscht!")
            window.location.reload()
          }
        }).catch((err) => {

        })
      })

      // edit button
      editBtn.innerHTML = 'Bearbeiten'
      editBtn.className = 'editBtn'
      editBtn.classList.add('btn-dash')
      editBtn.setAttribute('data-url', item.url)
      editBtn.setAttribute('data-uuid', item.uuid)
      editBtn.addEventListener('click', () => editQRCode(item.url, item.uuid))

      li.className = 'listEntry'
      div.className = 'listEntryContent'

      //append
      div.appendChild(name)
      div.appendChild(deactivateBtn)
      div.appendChild(deleteBtn)
      div.appendChild(editBtn)
      li.appendChild(div)
      ul.appendChild(li)
    })
  }

  const editQRCode = (url, uuid) => {
    const editMenu = document.createElement('div')
    const editMenuContent = document.createElement('div')
    const editMenuHeader = document.createElement('h1')
    const editMenuInput = document.createElement('input')
    const editMenuBtn = document.createElement('button')
    editMenu.className = 'editMenu'
    editMenuContent.className = 'editMenuContent'
    editMenuHeader.innerHTML = 'QRCode bearbeiten'
    editMenuHeader.className = 'editMenuHeader'
    editMenuInput.className = 'editMenuInput'
    editMenuInput.setAttribute('type', 'text')
    editMenuInput.setAttribute('placeholder', 'Text/URL')
    editMenuInput.setAttribute('value', url)
    editMenuBtn.className = 'editMenuBtn'
    editMenuBtn.innerHTML = 'Speichern'
    editMenuBtn.addEventListener('click', () => {
      axios.post(urlbackend + '/api/editcode', {
        uuid: uuid,
        url: editMenuInput.value
      }).then((response) => {
        if(response.data.success === false){
          alert(response.data.msg)
        }else{
          alert("QRCode bearbeitet!")
          window.location.reload()
        }
      }).catch((err) => {
        alert(err)
      })
      editMenu.remove()
      editMenuContent.remove()
    })
    editMenuContent.appendChild(editMenuHeader)
    editMenuContent.appendChild(editMenuInput)
    editMenuContent.appendChild(editMenuBtn)
    editMenu.appendChild(editMenuContent)
    document.body.appendChild(editMenu)
  }

  return (
    <div className="Dashboard" onLoad={fetchData}>
      <img src={auth.currentUser.photoURL || usericon} onClick={togglePopup} onLoad={initPopup} className="usericon" alt="usericon" />
      <div id="accmenu">
        <button id="dashboardBtn"><Link id="link" to="/">Home</Link></button>
        <button id="logoutBtn" onClick={() => auth.signOut()}>Log out</button>
      </div>
      <div className="list" id="list">
        <ul className="codelist" id="codelist"></ul>
      </div>
    </div>
  )
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

  const initPopup = () => {
    menu = document.getElementById('accmenu')
    menu.style.display = 'none'
  }

  function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'
    ) // fragment locator
    return !!pattern.test(str)
  }

  const genQRCode = () => {
    const input = document.getElementsByClassName('urlInput')[0]
    const agreement = document.getElementsByClassName('checkBoxAgreement')[0]
    const agreement2 = document.getElementsByClassName('agreementText')[0]
    const submit = document.getElementsByClassName('submit')[0]
    const dlqr = document.createElement('button')
    const pannel = document.getElementsByClassName('panel')[0]
    const uniqueID = UUID()

    //setup dlqr button
    dlqr.className = 'dl'
    dlqr.innerHTML = 'QR-Code herunterladen'

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
        submit.remove()
        agreement.remove()
        agreement2.remove()
        input.remove()
        pannel.appendChild(dlqr)
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
        <img src={auth.currentUser.photoURL || usericon} onClick={togglePopup} onLoad={initPopup} className="usericon" alt="usericon" />
        <div id="accmenu">
          <button id="dashboardBtn"><Link id="link" to="/dashboard">Dashboard</Link></button>
          <button id="logoutBtn" onClick={() => auth.signOut()}>Log out</button>
        </div>
        <div className="panel">
          <h1 className="newQRText">Neuer QRCode</h1>
          <QRcode 
              className="QrCodePreview"
              value={qr} 
              size={displayName}
              includeMargin={false}
              bgColor="#151a21"
              fgColor="#fff"
          />
          <input className="urlInput" type="text" placeholder="Text/URL"></input>
          <input type="checkbox"  className="checkBoxAgreement" id="checkBoxAgreement"></input> <label className="agreementText" htmlFor="checkBoxAgreement">Datenschutz Akzeptiert</label>
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

// eslint-disable-next-line
import React from 'react';
import usericon from './assets/usericon.svg';
import logo from './assets/logo.svg';
import './App.css';

import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
import 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
//components
import NotSignedIn, { initLogIn } from './components/Start/NotSignedIn';
import Banned from './components/Start/Banned';
import Redirect from './components/Start/Redirect';
import Text from './components/Start/Text';
import Invalid from './components/Start/Invalid';
import Deactivated from './components/Start/Deactivated';
import PreviewCode, { initPreviewCode } from './components/Start/PreviewCode';
import Error from './components/Start/Error';
import Dashboard, { initDashboard } from './components/Start/Dashboard';
import Home, { initHome } from './components/Start/Home';

let firebase = null;

try {
  firebase = initializeApp({
    apiKey: 'AIzaSyCRJNpLOTC1CMgyOeTarZ42hFuxb_X-Skw',
    authDomain: 'dynqr-admin-id.firebaseapp.com',
    projectId: 'dynqr-admin-id',
    storageBucket: 'dynqr-admin-id.appspot.com',
    messagingSenderId: '400113144848',
    appId: '1:400113144848:web:d612d8b739a350fb39e695',
    measurementId: 'G-KNQE3TDF0C'
  });
} catch (e) {
  console.log(`Already inited(${e})`);
}


const auth = getAuth(firebase);

// const url = 'http://localhost:3000'
// const urlbackend = 'http://localhost'
const urlbackend = 'http://192.168.178.31'

//init components
initLogIn( auth, logo, usericon);
initPreviewCode(urlbackend, logo);
initDashboard(auth,urlbackend, usericon)
initHome(urlbackend, auth, usericon, logo);

function App() {

  const [user, loading, error] = useAuthState(auth);
  const banned = localStorage.getItem('banned')

  const router = createBrowserRouter([
    {
      path: "/",
      element: loading ? null : (banned ? <Banned /> : (user ? <Home /> : <NotSignedIn/>)),
    },
    {
      path: "/redirect",
      element: <Redirect />,
    },
    {
      path: "/text",
      element: <Text />,
    },
    {
      path: "/invalid",
      element: <Invalid />,
    },
    {
      path: "/blocked",
      element: <Deactivated />,
    },
    {
      path: "/preview",
      element: <PreviewCode />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/home",
      element: <Home />,
    },
    {
      path: "*",
      element: <Error />,
    },
  ]);

  return (
    <>
      {error ? <Error/> : 
      <div className='App'>
        <RouterProvider router={router} />
    </div>}
    </>
  );
}

export default App;

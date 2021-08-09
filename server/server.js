//imports
const express = require('express')
const app = express();
const port = 80;
const cors = require('cors');
const firebase = require('firebase/app')
require('firebase/firestore');

firebase.initializeApp({ // App init
    apiKey: "AIzaSyCRJNpLOTC1CMgyOeTarZ42hFuxb_X-Skw",
    authDomain: "dynqr-admin-id.firebaseapp.com",
    projectId: "dynqr-admin-id",
    storageBucket: "dynqr-admin-id.appspot.com",
    messagingSenderId: "400113144848",
    appId: "1:400113144848:web:d612d8b739a350fb39e695",
    measurementId: "G-KNQE3TDF0C"
});
const firestore = firebase.firestore(); // Firestore initialisieren

var urlfrontend = 'http://localhost:3000'; // Die URL vom FrontEnd

app.use(cors());
app.use(express.json())
app.use(express.urlencoded())

app.post('/api/addQrCode', (req, res) => {
    const uuid = req.body.uuid;
    const userID = req.body.userID;
    const url = req.body.url;
    const username = req.body.username;
    const isUrl = req.body.isUrl;
    firestore.collection('QRCodes').doc(uuid).set({
        uuid: uuid,
        userID: userID,
        url: url,
        username: username,
        isUrl: isUrl,
        blocked: false
    }
    ).then(() => {
        res.sendStatus(200); // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_success (200=OK)
    }).catch(() => {
        res.sendStatus(500); // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_server_errors (500=Server)
    })
})
app.get('/func/redir/:id', (req, res) => {
    console.log('req');
    const uuid = req.params.id
    const isUrl = firestore.collection('QRCodes').doc(uuid).get().then((doc) => {
        if(doc.exists){
            if(doc.data().isUrl){
                res.redirect(urlfrontend + "/redir?url=" + doc.data().url)
            }else{
                res.redirect(urlfrontend + "/text?text=" + doc.data().url)
            }
        }else{
            res.redirect(urlfrontend + '/invalid')
        }
    });
})

app.listen(port, () => {
    console.log(`server läuft: http://localhost:${port}`)
})

// Axios code:
//
// axios.post('/api/addQrCode', {
//   userID: '1234',//data
//   url: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
//   uuid: '1b9b80ca-bf1a-4904-8cd2-535121967933',
//   username: 'gamer si',
//   blocked: false,
//   isUrl: true
// }).then((response) => {
//   if(response.status == 200){
//     //OK
//   }else{
//     //Fehler
//   }
// })
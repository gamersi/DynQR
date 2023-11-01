//imports
import express from 'express';
const app = express()
const port = 80
import cors from 'cors'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, where, getDoc, getDocs, setDoc, updateDoc, doc, deleteDoc, orderBy} from 'firebase/firestore/lite'

const fApp = initializeApp({ // App init
    apiKey: "AIzaSyCRJNpLOTC1CMgyOeTarZ42hFuxb_X-Skw",
    authDomain: "dynqr-admin-id.firebaseapp.com",
    projectId: "dynqr-admin-id",
    storageBucket: "dynqr-admin-id.appspot.com",
    messagingSenderId: "400113144848",
    appId: "1:400113144848:web:d612d8b739a350fb39e695",
    measurementId: "G-KNQE3TDF0C"
})

var urlfrontend = 'http://192.168.178.31:3000'; // Die URL vom FrontEnd

const db = getFirestore(fApp); // Firestore init

app.use(cors())
app.use(express.json())
app.use(express.urlencoded())

/*
    --------------
    Die API-Routen
    --------------
*/

app.post('/api/addQrCode', (req, res) => {
    const {uuid, userID, url, username, isUrl} = req.body;
    const document = doc(db, 'QRCodes/' + uuid)
    setDoc(document, {
        uuid: uuid,
        userID: userID,
        url: url,
        username: username,
        isUrl: isUrl,
        blocked: false
    }).then(() => {
        res.sendStatus(200)  // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_success (200=OK)
    }).catch(() => {
        res.sendStatus(500)  // https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#5xx_server_errors (500=Server)
    })
})

app.post('/api/getqrcodes', (req, res) => {
    const { uid } = req.body;
    if (!uid) return res.send({ success: 'false', msg: 'Keine UID angegeben' })
    const QRcodes = collection(db, 'QRCodes')
    getDocs(QRcodes, where('userID', '==', uid), orderBy('url')).then(docs => {
        docs.forEach(doc => {
            data.push(doc.data())
        })
        res.send(data)
    }).catch(() => {
        res.send({ success: 'false', msg: 'Unbekannter Fehler' })
    })
})

app.post('/api/deletecode', (req, res) => {
    const { uuid } = req.body;
    //delete QR code
    deleteDoc(doc(db, 'QRCodes/' + uuid)).then(() => {
        res.send({ success: true })
    }).catch(() => {
        res.send({ success: false })
    })
    // collection(db, 'QRCodes').doc(uuid).delete().then(() => {
    //     res.send({ success: true })
    // }).catch(() => {
    //     res.send({ success: false })
    // })
})

app.post('/api/deactivatecode', (req, res) => {
    const { uuid } = req.body;
    //deactivate QR code (set blocked to true)
    updateDoc(doc(db, 'QRCodes/' + uuid), {
        blocked: true
    }).then(() => {
        res.send({ success: true })
    }).catch(() => {
        res.send({ success: false })
    })
})

app.post('/api/activatecode', (req, res) => {
    const { uuid } = req.body;
    //deactivate QR code (set blocked to true)
    updateDoc(doc(db, 'QRCodes/' + uuid), {
        blocked: false
    }).then(() => {
        res.send({ success: true })
    }).catch(() => {
        res.send({ success: false })
    })
    // collection(db, 'QRCodes').doc(uuid).update({
    //     blocked: false
    // }).then(() => {
    //     res.send({ success: true })
    // }).catch(() => {
    //     res.send({ success: false, msg: 'Unbekannter Fehler' })
    // })
})

app.post('/api/getactive', (req, res) => {
    const { uuid } = req.body;
    //check if blocked is true or false
    const coll = collection(db, 'QRCodes')
    getDoc(doc(db, 'QRCodes/' + uuid)).then(doc => {
        res.send({ success: true, blocked: doc.data().blocked })
    }).catch(() => {
        res.send({ success: false, msg: 'Unbekannter Fehler' })
    })
})

app.post('/api/editcode', (req, res) => {
    const { uuid, url, isUrl} = req.body;
    // set url to url
    updateDoc(doc(db, 'QRCodes/' + uuid), {
        url: url,
        isUrl: isUrl
    }).then(() => {
        res.send({ success: true })
    }).catch(() => {
        res.send({ success: false, msg: 'Unbekannter Fehler' })
    })
    // collection(db, 'QRCodes').doc(uuid).update({
    //     url: url
    // }).then(() => {
    //     res.send({ success: true })
    // }).catch(() => {
    //     res.send({ success: false, msg: 'Unbekannter Fehler' })
    // })
})

app.post('/api/geturl', (req, res) => {
    const { uuid } = req.body;
    //get url
    getDoc(doc(db, 'QRCodes/' + uuid)).then(doc => {
        res.send({ success: true, url: doc.data().url })
    }).catch(() => {
        res.send({ success: false, msg: 'Unbekannter Fehler' })
    })
    // collection(db, 'QRCodes').doc(uuid).get().then((doc) => {
    //     res.send({ success: true, url: doc.data().url })
    // }).catch(() => {
    //     res.send({ success: false, msg: 'Unbekannter Fehler' })
    // })
})


/*
    --------------
    Die Funktionen
    --------------
*/

app.get('/func/redir/:id', (req, res) => {
    const uuid = req.params.id
    getDoc(doc(db, 'QRCodes/' + uuid)).then(doc => {
        if(doc.exists){
            if(doc.data().blocked){
                return res.redirect(urlfrontend + '/blocked')
            }
            if(doc.data().isUrl){
                res.redirect(urlfrontend + "/redirect?url=" + doc.data().url)
            }else{
                res.redirect(urlfrontend + "/text?text=" + doc.data().url)
            }
        }else{
            res.redirect(urlfrontend + '/invalid')
        }
    });
    // collection(db, 'QRCodes').doc(uuid).get().then((doc) => {
    //     if(doc.exists){
    //         if(doc.data().blocked){
    //             return res.redirect(urlfrontend + '/blocked')
    //         }
    //         if(doc.data().isUrl){
    //             res.redirect(urlfrontend + "/redirect?url=" + doc.data().url)
    //         }else{
    //             res.redirect(urlfrontend + "/text?text=" + doc.data().url)
    //         }
    //     }else{
    //         res.redirect(urlfrontend + '/invalid')
    //     }
    // });
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
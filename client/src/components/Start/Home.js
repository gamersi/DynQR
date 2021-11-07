import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
let urlbackend = null
let auth = null
let usericon = null
let logo = null

function setUrlBackend(url) {
    urlbackend = url
}
function setAuth(_auth) {
    auth = _auth
}
function setUserIcon(_usericon) {
    usericon = _usericon
}
function setLogo(_logo) {
    logo = _logo
}
export function initHome(url, _auth, _usericon, _logo) {
    setUrlBackend(url)
    setAuth(_auth)
    setUserIcon(_usericon)
    setLogo(_logo)
}

export default function Home(){
    const [qr, setQr] = useState('DynQR ist die beste Website!');
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
  
    const showPopup = (text, reloadOnClose) => {
      const editMenu = document.createElement('div')
      const editMenuContent = document.createElement('div')
      const editMenuHeader = document.createElement('h1')
      const editMenuBtn = document.createElement('button')
      editMenu.className = 'editMenu'
      editMenuContent.className = 'editMenuContent'
      editMenuHeader.innerHTML = text
      editMenuHeader.className = 'editMenuHeader'
      editMenuBtn.className = 'editMenuBtn'
      editMenuBtn.innerHTML = 'OK'
      editMenuBtn.addEventListener('click', () => {
        editMenu.remove()
        editMenuContent.remove()
        if(reloadOnClose) window.location.reload()
      })
      editMenuContent.appendChild(editMenuHeader)
      editMenuContent.appendChild(editMenuBtn)
      editMenu.appendChild(editMenuContent)
      document.body.appendChild(editMenu)
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
      const qrlink = document.createElement('a')
      const pannel = document.getElementsByClassName('panel')[0]
      const uniqueID = UUID()
  
      setQr(urlbackend + '/func/redir/' + uniqueID)
  
      //setup dlqr button
      dlqr.className = 'download'
      dlqr.innerHTML = 'QR-Code herunterladen'
      dlqr.addEventListener('click', () => {
        var canvas = document.getElementsByClassName('QrCodePreview')[0];
        var link = document.createElement('a');
        link.download = 'qr.png';
        link.href = canvas.toDataURL("image/png");
        link.click();
      })
  
      //setup qrlink
      qrlink.className = 'qrlink'
      qrlink.href = urlbackend + '/func/redir/' + uniqueID
      qrlink.target = '_blank'
      qrlink.innerHTML = urlbackend + '/func/redir/' + uniqueID
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
          showPopup(`FEHLER(${response.status})`, false)
        }else{
          submit.remove()
          agreement.remove()
          agreement2.remove()
          input.remove()
          pannel.appendChild(dlqr)
          pannel.appendChild(qrlink)
          showPopup('QR-Code erfolgreich erstellt', false)
        }
      }).catch((err) => {
        console.log(err)
        showPopup('FEHLER:' + err, false)
      })
      
    }
    document.addEventListener('load', () => {
      document.getElementsByClassName('submit')[0].addEventListener('click', genQRCode)
    })
    return (
      <div className='signedIn'>
          <img src={logo} className='logo' alt='logo' />
          <img src={auth.currentUser.photoURL || usericon} onClick={togglePopup} onLoad={initPopup} className='usericon' alt='usericon' />
          <div id='accmenu'>
            <button id='dashboardBtn'><Link id='link' to='/dashboard'>Dashboard</Link></button>
            <button id='logoutBtn' onClick={() => auth.signOut()}>Log out</button>
          </div>
          <div className='panel'>
            <h1 className='newQRText'>Neuer QRCode</h1>
            <QRCode
                className='QrCodePreview'
                value={qr} 
                size={128}
                includeMargin={false}
                bgColor='#151a21'
                fgColor='#fff'
            />
            <input className='urlInput' type='text' placeholder='Text/URL'></input>
            <input type='checkbox'  className='checkBoxAgreement' id='checkBoxAgreement'></input> <label className='agreementText' htmlFor='checkBoxAgreement'>Datenschutz Akzeptiert</label>
            <button className='submit' onClick={genQRCode}>QRCode erstellen</button>
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
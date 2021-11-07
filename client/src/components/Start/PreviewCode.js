import React, { useEffect, useState } from 'react';
import QRcode from 'qrcode.react'
let urlbackend = null;
let logo = null;


export function initPreviewCode(urlbackend_, logo_) {
    urlbackend = urlbackend_;
    logo = logo_;
}

export default function PreviewCode(){

    const [qr, setQr] = useState('DynQR ist die beste website');
  
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
  
    useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if(id === null) return showPopup('Fehler!', false)
      setQr(urlbackend + '/func/redir/' + id)
    }, []);
  
    return (
      <div className='previewCode'>
          <img src={logo} className='logo' alt='logo' />
          <div className='panel'>
            <h1 className='white'>QR-Code:</h1>
            <QRcode
              className='QRCodePreviewSite'
              value={qr}
              includeMargin={false}
              bgColor='#151a21'
              fgColor='#fff'
            />
          </div>
      </div>
    );
  }
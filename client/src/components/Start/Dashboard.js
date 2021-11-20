import axios from "axios";
import { Link } from "react-router-dom";
let auth = null
let urlbackend = null
let usericon = null

function setAuth(auth_) {
  auth = auth_
}
function setUrlBackend(urlbackend_) {
    urlbackend = urlbackend_
}
function setUserIcon(usericon_) {
    usericon = usericon_
}
export function initDashboard(auth_, urlbackend_, usericon_) {
  setAuth(auth_)
  setUrlBackend(urlbackend_)
  setUserIcon(usericon_)
}

export default function Dashboard(){
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
        showPopup('Fehler: ' + err, false)
      })
    }
  
    const displayError = async (err) => {
      const ul = document.getElementById('codelist')
      const parent = document.getElementById('list')
      const errText = document.createElement('h1')
      errText.innerHTML = err
      errText.className = 'white'
      errText.classList.add('error')
      parent.appendChild(errText)
      ul.remove()
    }
  
    const displayList = async(list) => {
      const ul = document.getElementById('codelist')
      list.forEach(async(item) => {
        if(item === null) return
        let isActive;
        let uuid = item.uuid
        await axios.post(urlbackend + '/api/getactive', {
          uuid
        }).then((response) => {
          if(response.data.success === false){
            displayError(response.data.msg)
          }else{
            isActive = !response.data.blocked
          }
        }).catch((err) => {
          showPopup('Fehler:' + err, false)
        })
        
        const li = document.createElement('li')
        const div = document.createElement('div')
        const name = document.createElement('h1')
        const deactivateBtn = document.createElement('button')
        const deleteBtn = document.createElement('button')
        const editBtn = document.createElement('button')
        const previewBtn = document.createElement('button')
        name.innerHTML = item.url
        name.className = 'name'
  
        // deactivate button
        deactivateBtn.innerHTML = isActive ? 'Deaktivieren' : 'Reaktivieren'
        deactivateBtn.className = 'deactivateBtn'
        deactivateBtn.classList.add('btn-dash')
        deactivateBtn.setAttribute('data-url', item.url)
        deactivateBtn.setAttribute('data-uuid', item.uuid)
        deactivateBtn.addEventListener('click', () => {
          let furl = isActive ? '/api/deactivatecode' : '/api/activatecode'
          axios.post(urlbackend + furl, {
            uuid: item.uuid,
          }).then((response) => {
            if(response.data.success === false){
              displayError(response.data.msg)
            }else{
              showPopup(isActive ? 'QRCode deaktiviert!' : 'QRCode reaktiviert!', true)
            }
          }).catch((err) => {
            showPopup('Fehler: ' + err, false)
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
              showPopup(response.data.msg, false)
            }else{
              showPopup('QRCode gelöscht!', true)
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
  
        //preview button
        previewBtn.innerHTML = 'Vorschau'
        previewBtn.className = 'previewBtn'
        previewBtn.classList.add('btn-dash')
        previewBtn.setAttribute('data-url', item.url)
        previewBtn.setAttribute('data-uuid', item.uuid)
        previewBtn.addEventListener('click', () => window.location.href = '/preview?id=' + item.uuid)
  
        li.className = 'listEntry'
        div.className = 'listEntryContent'
  
        //append
        div.appendChild(name)
        div.appendChild(deactivateBtn)
        div.appendChild(deleteBtn)
        div.appendChild(editBtn)
        div.appendChild(previewBtn)
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
        axios.post(urlbackend + '/api/editcode', {
          uuid: uuid,
          url: editMenuInput.value,
          isUrl: validURL(editMenuInput.value)
        }).then((response) => {
          if(response.data.success === false){
            showPopup(response.data.msg, false)
          }else{
            showPopup('QRCode bearbeitet!', true)
          }
        }).catch((err) => {
          showPopup('Fehler: ' + err, false)
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
  
    return (
      <div className='Dashboard' onLoad={fetchData}>
        <img src={auth.currentUser.photoURL || usericon} onClick={togglePopup} onLoad={initPopup} className='usericon' alt='usericon' />
        <div id='accmenu'>
          <button id='dashboardBtn'><Link id='link' to='/'>Home</Link></button>
          <button id='logoutBtn' onClick={() => auth.signOut()}>Log out</button>
        </div>
        <div className='list' id='list'>
          <ul className='codelist' id='codelist'></ul>
        </div>
      </div>
    )
  }
let firebase = null
let auth = null
let logo = null
let usericon = null

export function initLogIn(firebase_, auth_, logo_, usericon_) {
    firebase = firebase_
    auth = auth_
    logo = logo_
    usericon = usericon_
}

export default function NotSignedIn(){
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then((response) => {
        localStorage.setItem('uid', response.user.uid)
        }).catch((rejected) => {
        if(rejected.code === 'auth/user-disabled'){
            showPopup('Dieser Account wurde deaktiviert!', false)
            localStorage.setItem('banned', true)
        }else{
            showPopup('Fehler(Sonstige/' + rejected.code + ')!', false);
        }
        }); 
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
        <div className='signIn'>
            <img src={logo} className='logo' alt='logo' />
            <img src={usericon} className='usericon-lkd' alt='usericon' />
            <div className='panel'>
            <button className='loginBtn' onClick={signInWithGoogle}>Login</button>
            </div>
        </div>
    );
}
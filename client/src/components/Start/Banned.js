export default function Banned() {
    const retry = () => {
        localStorage.removeItem('banned')
        window.location.reload()
      }
      return (
        <div className='Banned'>
            <h1 className='white'>Du bist gebannt!</h1>
            <div className='panel'>
              <button className='loginBtn' onClick={retry}>Erneut Probieren</button>
            </div>
        </div>
      );
}
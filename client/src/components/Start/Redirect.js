export default function Redirect(){
    const redirect = () => {
        const params = new URLSearchParams(window.location.search);
        const url = params.get('url');
        if(url.startsWith('http')){
        window.location.replace(url);
        }else{
        window.location.replace('http://' + url);
        }
    }

    return (
        <div className='Redirect'>
            <h1 className='white' onLoad={redirect()} >Weiterleitung</h1>
        </div>
    );
}
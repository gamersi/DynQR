import React, { useEffect, useState } from 'react';

export default function Text(){
    const [text, setText] = useState('Loading...');
  
    useEffect(() => {
      console.log('hi')
      const params = new URLSearchParams(window.location.search);
      const text = params.get('text');
      if(text !== null) setText(text);
      if(text === null) setText('Fehler!')
    }, []);
  
    return (
      <div className='Text'>
          <h1 className='white' id='textDisplay'>{text}</h1>
      </div>
    );
}
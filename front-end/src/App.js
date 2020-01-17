import React from 'react';
import Home from './components/home/Home'
import { Redirect } from 'react-router-dom';

function App() {
  if(localStorage.getItem('whatsapp'))
  return (
    <Home/>
  );
  else
  return(<Redirect to='/signup'/>)
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// Add CSS Loader
import './app.style.css';

ReactDOM.render(<App/>,document.querySelector('.app'));

if(module.hot){ 
    module.hot.accept();
}
var i =1;
console.log(i)
import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Home } from './components/Home'
import registerServiceWorker from './registerServiceWorker';

const baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
const rootElement = document.getElementById('root');

document.title = "Rolling Retention";
ReactDOM.render(
  <BrowserRouter basename={baseUrl}>
    <Home />
  </BrowserRouter>,
  rootElement);

registerServiceWorker();


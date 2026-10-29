import React from 'react';
import ReactDOM from 'react-dom/client';
import OceanNavigatorLite from './components/OceanNavigatorLite.jsx'

import './stylesheets/main.scss';
import 'bootstrap/dist/css/bootstrap.css';
import './stylesheets/bootstrap.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <OceanNavigatorLite />
  </React.StrictMode>
);
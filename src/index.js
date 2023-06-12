import React from 'react';
import ReactDOM from 'react-dom/client';
import OceanNavigatorLite from './components/OceanNavigatorLite.jsx'

require("./stylesheets/main.scss");

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <OceanNavigatorLite />
  </React.StrictMode>
);
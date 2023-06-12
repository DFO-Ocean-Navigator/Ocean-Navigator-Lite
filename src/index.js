import React from 'react';
import ReactDOM from 'react-dom/client';
import OceanNavigatorLite from './components/OceanNavigatorLite.jsx'

require("./stylesheets/main.scss");
require("bootstrap/dist/css/bootstrap.css");
require("./stylesheets/bootstrap.css");

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <OceanNavigatorLite />
  </React.StrictMode>
);
import React from 'react';
import ReactDOM from "react-dom";
// tailwind in index.css
import './index.css';
// optional
import reportWebVitals from './reportWebVitals';

import WebApp from './pages/webapp';
import Account from './pages/account';
import Layout from './components/Layout';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {connectSigner} from './casper/lib.js';

export default function App(){
  // connect Casper Signer on page load
  connectSigner();
  return(
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
          <Route index element={<Account />} />
          <Route path="app" element={<WebApp />} />
        </Route>
      </Routes>
    </BrowserRouter>
    );
}

ReactDOM.render(<App />, document.getElementById("root"));
reportWebVitals();

import React from 'react';
import ReactDOM from "react-dom";
import './index.css';
import reportWebVitals from './reportWebVitals';
import WebApp from './pages/webapp';
import Account from './pages/account';
import Layout from './components/Layout';
import {
  BrowserRouter,
  Routes, //replaces "Switch" used till v5
  Route,
} from "react-router-dom";
import {connectSigner} from './casper/lib.js';
export default function App(){
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

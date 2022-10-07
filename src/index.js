import React from 'react';
import ReactDOM from "react-dom";
// tailwind in index.css
import './index.css';
// optional
import reportWebVitals from './reportWebVitals';

import WebApp from './pages/webapp';
import Account from './pages/account';
import History from './pages/history';
import Layout from './components/Layout';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {getStatus, connectSigner} from './casper/lib.js';

export default function App(){
  const [connectionStatus, setConnectionStatus] = React.useState(false);
  connectSigner();
  getStatus().then((status) => {
    setConnectionStatus(status);
  });
  
  if (connectionStatus == false){
    return (
      <div class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
      	<div class="animate-spin loader ease-linear rounded-half border-4 border-t-4 border-gray-100 h-12 w-12 mb-4"></div>
      	<h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
      	<p class="w-1/3 text-center text-white">If loading takes longer than a few seconds, unlock the Signer and refresh the website.</p>
      </div>
    );
  }

  else{
    return(
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
            <Route index element={<Account />} />
            <Route path="app" element={<WebApp />} />
            <Route path="history" element={<History/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
      );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
reportWebVitals();

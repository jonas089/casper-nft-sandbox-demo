import React, {useState, useEffect} from 'react';
import ReactDOM from "react-dom";
import {Signer} from 'casper-js-sdk';
// tailwind in index.css
import './index.css';
// optional
import reportWebVitals from './reportWebVitals';
import LoadingPluginScreen from './components/LoadingPlugin';
import WebApp from './pages/webapp';
import Account from './pages/account';
import History from './pages/history';
import Layout from './components/Layout';

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {getStatus, connectSigner, getPluginStatus} from './casper/lib.js';

export default function App(){
  const [connectionStatus, setConnectionStatus] = React.useState(false);
  const [pluginStatus, updatePluginStatus] = React.useState(false);
  const [count, setCount] = useState(0);
  useEffect(() => {
    setTimeout(() => {
      setCount(count + 1);
      console.log(count);
      if (getPluginStatus() == true){
        console.log("Plugin is connected.");
        updatePluginStatus(true);
        if (!connectionStatus){
          connectSigner();
        }
      }
      else{
        console.log("Plugin not connected.");
      }
    }, 1000);
  });
  if (pluginStatus == false){
    return(
      <div>
        <LoadingPluginScreen/>
      </div>
    )
  }
  else{
    getStatus().then(status => {
      setConnectionStatus(status);
    });
    if (connectionStatus == true){
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
    else{
      return(
        <div>
          <LoadingPluginScreen/>
        </div>
      )
    }
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
reportWebVitals();

import React from 'react';
import { CLPublicKey, CLAccountHash } from 'casper-js-sdk';
import { getStatus, connectSigner } from '../casper/lib.js';
import LoadingScreen from '../components/Loading.jsx';
import WebAppComponent from '../components/WebApp.jsx';
function WebApp() {
  const [PubKey, setPubKey] = React.useState(null);
  const [AccountHash, setAccountHash] = React.useState(null);

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [url, setUrl] = React.useState('');
  const [Id, setId] = React.useState('');
  const [Recipient, setRecipient] = React.useState('');

  const handleName = event => {
    setName(event.target.value);
  };
  const handleDescription = event => {
    setDescription(event.target.value);
  };
  const handleUrl = event => {
    setUrl(event.target.value);
  };
  const handleId = event => {
    setId(event.target.value);
  }
  const handleRecipient = event => {
    setRecipient(event.target.value);
  }

  getStatus().then(s => {
    if (s == true){
      window.casperlabsHelper.getActivePublicKey().then(
        pubKey => {
          console.log(pubKey);
          setPubKey(pubKey);
        }
      );
    }
    else{
      connectSigner();
    }
  });
  if (PubKey != null && AccountHash == null){
    const accountHex = CLPublicKey.fromHex(PubKey).toAccountHash();
    const clKeyAccHash = new CLAccountHash(accountHex);
    console.log("Account-Hash CLValue: ", clKeyAccHash);
    setAccountHash(clKeyAccHash);
  }

  if (AccountHash == null){
    return (
      <LoadingScreen />
    )
  }
  else{
    // To be done:
    // Move this render to a component named Account.jsx / AccountComponent class.
    // Call Mint from within the component, move handlers for input to the component.
    // Pass props similar to Account and History
    return (
      <WebAppComponent PubKey={PubKey} AccountHash={AccountHash} name={name} setName={setName} description={description} setDescription={setDescription} url={url} setUrl={setUrl} Id={Id} setId={setId} Recipient={Recipient} setRecipient={setRecipient} handleName={handleName} handleId={handleId} handleUrl={handleUrl} handleRecipient={handleRecipient} handleDescription={handleDescription}/>
    );
  }
}

export default WebApp;

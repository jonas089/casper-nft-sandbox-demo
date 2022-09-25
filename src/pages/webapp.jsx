import React from 'react';
import { Mint, Transfer } from '../casper/network.js';
import { CLPublicKey, CLAccountHash } from 'casper-js-sdk';
import { getStatus, connectSigner } from '../casper/lib.js';

function WebApp() {
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

  const [PubKey, setPubKey] = React.useState(null);
  const [AccountHash, setAccountHash] = React.useState(null);

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
      <div class="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
      	<div class="animate-spin loader ease-linear rounded-half border-4 border-t-4 border-gray-100 h-12 w-12 mb-4"></div>
      	<h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
      	<p class="w-1/3 text-center text-white">If loading takes longer than a few seconds, unlock the Signer and refresh the website.</p>
      </div>
    )
  }
  else{
    return (
      <div className='bg-gray-800'>
        <h1 className='text-red-400 text-center outline outline-red-400'>Sandbox App</h1>

        <div className='grid py-[5%] place-items-center divide-x'>
          <div className="w-full max-w-xs">
            <form className="bg-white shadow-md rounded px-5 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" for="name">
                  Name
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="name..." onChange={handleName} value={name}/>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" for="description">
                  Description
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="description" type="text" placeholder="description..." onChange={handleDescription} value={description}/>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" for="url">
                  Url
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="url" type="text" placeholder="https://some.url/" onChange={handleUrl} value={url}/>
              </div>

              <div className="grid place-items-center">
                <button onClick={() => Mint(name, description, url, AccountHash, PubKey)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                  Mint
                </button>
              </div>
            </form>

            <form className="bg-white shadow-md rounded px-5 pt-6 pb-8 mb-4">
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" for="description">
                  Hash Id
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="Id" type="text" placeholder="Token Hash Id..." onChange={handleId} value={Id}/>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" for="url">
                  Recipient
                </label>
                <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="Recipient" type="text" placeholder="0x00" onChange={handleRecipient} value={Recipient}/>
              </div>

              <div className="grid place-items-center">
                <button onClick={() => Transfer(Id, Recipient, AccountHash, PubKey)} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
                  Transfer
                </button>
              </div>
            </form>

          </div>
        </div>
      </div>
    );
  }
}

export default WebApp;

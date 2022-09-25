import React from 'react';
import { Mint } from '../casper/network.js';
import { CLPublicKey, CLAccountHash } from 'casper-js-sdk';
import { getStatus, connectSigner } from '../casper/lib.js';
function WebApp() {
  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [url, setUrl] = React.useState('');
  const handleName = event => {
    setName(event.target.value);
  };
  const handleDescription = event => {
    setDescription(event.target.value);
  };
  const handleUrl = event => {
    setUrl(event.target.value);
  };

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
      <div className='text-center content-center'>
        <h1>
          Loading...
        </h1>
        <h1>
          If this state persists, unlock the Signer and re-load the application.
        </h1>
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
          </div>
        </div>
      </div>
    );
  }
}

export default WebApp;

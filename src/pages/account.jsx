import React from 'react';
import {CLPublicKey, CLAccountHash} from 'casper-js-sdk';
import {connectSigner, getStatus} from '../casper/lib.js';
function Account() {
  const [PubKey, setPubKey] = React.useState(null);
  const [AccountHash, setAccountHash] = React.useState(null);

  const [OwnedNFTs, setOwnedNFTs] = React.useState([]);

  getStatus().then(s => {
    if (s == true){
      window.casperlabsHelper.getActivePublicKey().then(
        pubKey => {
          console.log(pubKey);
          setPubKey(pubKey);
        }
      );
    };
  });
  if (PubKey != null && AccountHash == null){
    const accountHex = CLPublicKey.fromHex(PubKey).toAccountHash();
    const clKeyAccHash = new CLAccountHash(accountHex);
    console.log("Account-Hash CLValue: ", clKeyAccHash);
    setAccountHash(clKeyAccHash);
  }

  if (PubKey != null && AccountHash != null){
    // get owned NFTs from collection and
    // add to OwnedNFTs state. => then render.
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
        <h1 className='text-red-400 text-center outline outline-red-400'>My NFTs</h1>
      </div>
    );
  }
}

export default Account;

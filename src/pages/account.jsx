import React from 'react';
import {CLPublicKey, CLAccountHash, CLValueBuilder} from 'casper-js-sdk';
import {connectSigner, getStatus} from '../casper/lib.js';
import {getOwnedIds} from '../casper/network.js';

function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
  return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function Account() {
  const [PubKey, setPubKey] = React.useState(null);
  const [AccountHash, setAccountHash] = React.useState(null);
  const [fetchStatus, setFetchStatus] = React.useState(false);
  const [OwnedNFTs, setOwnedNFTs] = React.useState([]);

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

  if (PubKey != null && AccountHash != null && fetchStatus == false){

    //console.log("Typed account hash: ", AccountHash);
    
    let accHash = CLPublicKey.fromHex(PubKey).toAccountHash();
    let accHashHex = toHexString(accHash);
    //AccountHash;
    getOwnedIds(accHashHex).then(res => {
      console.log(res);
      setOwnedNFTs(res);
      setFetchStatus(true);
    })
    // get owned NFTs from collection and
    // add to OwnedNFTs state. => then render.
  }

  if (AccountHash == null || fetchStatus == false){
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
        {OwnedNFTs.map((hash_id) => (
         <h1 className='text-white'>Owned Token at Hash: {hash_id}</h1> 
        ))}
      </div>
    );
  }
}

export default Account;

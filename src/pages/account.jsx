import React from 'react';
import {CLPublicKey, CLAccountHash, CLValueBuilder} from 'casper-js-sdk';
import {connectSigner, getStatus} from '../casper/lib.js';
import {getOwnedIds, getMetadata} from '../casper/network.js';
function toHexString(byteArray) {
  return Array.from(byteArray, function(byte) {
  return ('0' + (byte & 0xFF).toString(16)).slice(-2);
  }).join('')
}

function Account() {
  const [PubKey, setPubKey] = React.useState(null);
  const [AccountHash, setAccountHash] = React.useState(null);
  const [fetchStatus, setFetchStatus] = React.useState(false);
  const [metaStatus, setMetaStatus] = React.useState(false);
  const [OwnedNFTs, setOwnedNFTs] = React.useState([]);
  const [Metadata, setMetadata] = React.useState([]);

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

  if (fetchStatus == true && metaStatus == false){
    getMetadata(OwnedNFTs).then(
      meta => {
        setMetadata(meta);
        setMetaStatus(true);
      }
    );
  }

  if (AccountHash == null || metaStatus == false){
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
      <div>
        <h1 className='text-red-400 text-center outline outline-red-400'>My NFTs</h1>
        <div className='bg-gray-800 flex items-stretch items-center flex-wrap bg-cover'>
          {Metadata.map((meta, id) => (
            // style div with tailwind
            <div class="px-5 py-6">
            <div class="max-w-sm rounded break-all shadow-lg px-8 bg-gray-200 py-2 ">
                <p>{OwnedNFTs[id].toString()}</p>
                <img src={JSON.parse(meta)["nft_url"].toString()} alt="Random" className='w-full h-96' />
                <div class="px-6 py-4">
                    <div class="font-bold text-xl mb-2">{JSON.parse(meta)["nft_name"].toString()}</div>
                    <p class="text-gray-700 text-base">
                      {JSON.parse(meta)["nft_description"].toString()}
                    </p>
                </div>
            </div>
          </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Account;

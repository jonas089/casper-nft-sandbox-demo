import React from 'react';
import {CLPublicKey, CLAccountHash, CLValueBuilder} from 'casper-js-sdk';
import {connectSigner, getStatus} from '../casper/lib.js';
import {getOwnedIds, getMetadata} from '../casper/controller.js';
import {toHexString} from '../casper/helper.js'
import LoadingScreen from '../components/Loading.jsx';
import AccountComponent from '../components/Account.jsx';
function Account() {
  // constants that need to be set / fetched on render
  const [PubKey, setPubKey] = React.useState(null);
  const [AccountHash, setAccountHash] = React.useState(null);
  const [OwnedNFTs, setOwnedNFTs] = React.useState([]);
  const [Metadata, setMetadata] = React.useState([]);
  
  // booleans to track loading state
  const [fetchStatus, setFetchStatus] = React.useState(false);
  const [metaStatus, setMetaStatus] = React.useState(false);
  // the account page is the default landing page, so it will check for whether the server is active or not
  // if the server is inactive, an error page will be rendered.
  const [serverStatus, setServerStatus] = React.useState(true);

  // reconnect Signer if not connected and set public key
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

  // set account hash once the public key is set
  if (PubKey != null && AccountHash == null){
    const accountHex = CLPublicKey.fromHex(PubKey).toAccountHash();
    const clKeyAccHash = new CLAccountHash(accountHex);
    console.log("Account-Hash CLValue: ", clKeyAccHash);
    setAccountHash(clKeyAccHash);
  }


  // fetch owned NFTs once the account hash is set
  if (PubKey != null && AccountHash != null && fetchStatus == false){

    //console.log("Typed account hash: ", AccountHash);

    let accHash = CLPublicKey.fromHex(PubKey).toAccountHash();
    let accHashHex = toHexString(accHash);
    //AccountHash;
    getOwnedIds(accHashHex).then(res => {
      if (res == null){
        // Server error. Is the backend running?
        setServerStatus(false);
      }
      setOwnedNFTs(res);
      setFetchStatus(true);
    })
    // get owned NFTs from collection and
    // add to OwnedNFTs state. => then render.
  }

  // fetch metadata for each NFT once the NFTs are fetched
  if (fetchStatus == true && metaStatus == false && serverStatus == true){
    // getMetadata takes a list of hash identifiers
    getMetadata(OwnedNFTs).then(
      meta => {
        setMetadata(meta);
        setMetaStatus(true);
      }
    );
  }

  // render loading page until account hash is set and metadata has been queried.
  if ((AccountHash == null || metaStatus == false) && serverStatus == true){
    return (
      <LoadingScreen/>
    )
  }
  else if (serverStatus == false){
    return(
      <div>
        <h1>Server Error Landing Page.</h1>
      </div>
    )
  }
  // render account page once account hash is set and metadata has been queried.
  else{
    return (
      <AccountComponent Metadata={Metadata} OwnedNFTs={OwnedNFTs}/>
    );
  }
}

export default Account;

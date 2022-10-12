// This script features helper functions to integrate with the Casper Signer.
const { sleep } = require('./helper.js');
// async function to get CasperSigner connection status.
async function getStatus(){
  // temporary solution. Would be better to await the initialization of the chrome plugin.
  // Don't yet know how to optimize this process. Should work in most cases.
  // Refresh if connection request is not initiated.
  //await sleep(1000);
  let status = await window.casperlabsHelper.isConnected();
  return status;
}
function getPluginStatus(){
  console.log(window.casperlabsHelper);
  if (window.casperlabsHelper != undefined){
    return true;
  }
  else{
    return false;
  }
}
function connectSigner(){
  getStatus().then(s =>
    {
      if (s === false){
        console.log("Connecting...");
        window.casperlabsHelper.requestConnection();
      }
      else{
        console.log("Connection Status: ", s);
      }
  });
}

export {connectSigner, getStatus, getPluginStatus}

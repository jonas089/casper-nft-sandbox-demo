// This script constructs signed deploys and contract calls and sends them to server.js as an axios request.
// The express server blocks port 3000, react app will find a new port.
// Ports might have to be changed / opened for a production application.

import axios from 'axios';
import { RuntimeArgs, CLValueBuilder, Contracts, CasperClient, DeployUtil, CLPublicKey, Signer, CLAccountHash } from 'casper-js-sdk';
import { cep78_contract_hash, node_addr } from './constants.js';

// create an axios webrequest from a signed deploy or fetch request object.
async function getOwnedIds(account_hash){
    const client = await new CasperClient(node_addr);
    const data = {
      "account_hash": account_hash
    }
    const owned = await axios.post("http://localhost:3000/getOwnedIds", data, {headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}}).then((response) => {
        const owned = response.data;
        return owned
    }).catch((error) => {
        console.log(error);
        return null
    });
    return owned;
}

async function getMetadata(list){
    const client = await new CasperClient(node_addr);
    const data = {
      "list": list
    }
    const meta = await axios.post("http://localhost:3000/metadata", data, {headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}}).then((response) => {
        const meta = response.data;
        return meta
    }).catch((error) => {
        console.log(error);
        return null
    });
    return meta;
}


// Pass account_hash as CLAccountHash => will be converted to a CLKey.
async function Mint(name, description, url, account_hash, activeKey){
    console.log("Minting...");
    console.log("CLAccountHash: ", account_hash);
    const metadata =
        JSON.stringify({
            "nft_name": name,
            "nft_description": description,
            "nft_url": url
    });
    console.log("Metadata: ", CLValueBuilder.string(metadata));
    const args = RuntimeArgs.fromMap({
        'token_owner': CLValueBuilder.key(account_hash),
        'token_meta_data':CLValueBuilder.string(
             metadata)
            // Following the Sandbox deploy schema:
            //'{\"nft_name\":\"somename01\",\"nft_description\":\"somedescription01\",\"nft_url\":\"someurl01\"}'
    });
    console.log("PubKey Hex: ", activeKey);
    const pubkey = CLPublicKey.fromHex(activeKey);
    const client = await new CasperClient(node_addr);
    const contract = new Contracts.Contract(client);
    contract.setContractHash(cep78_contract_hash);
    console.log("Contract: ", contract);
    // paying fixed fee of 3 cspr for a mint
    console.log("Pubkey: ", pubkey);
    const result = contract.callEntrypoint("mint", args, pubkey, "casper-test", "3000000000", [], 10000000);
    const deployJson = DeployUtil.deployToJson(result);
    console.log("DeployJson: ", deployJson);
    Signer.sign(deployJson, activeKey).then((success) => {
        sendDeploy(success);
    }).catch((error) => {
        console.log(error);
    });
}

async function Transfer(id, recipient, AccountHash, activeKey){
    console.log("Transferring Token...");
    const accountHex = CLPublicKey.fromHex(recipient).toAccountHash();
    const clKeyAccHash = new CLAccountHash(accountHex);
    const args = RuntimeArgs.fromMap({
        'token_hash': CLValueBuilder.string(id),
        'source_key': CLValueBuilder.key(AccountHash),
        'target_key': CLValueBuilder.key(clKeyAccHash)
            // Sandbox deploy schema looks like this: 
            //'{\"nft_name\":\"somename01\",\"nft_description\":\"somedescription01\",\"nft_url\":\"someurl01\"}'
    });
    const pubkey = CLPublicKey.fromHex(activeKey);
    const client = await new CasperClient(node_addr);
    const contract = new Contracts.Contract(client);
    contract.setContractHash(cep78_contract_hash);
    console.log("Contract: ", contract);
    // paying fixed fee of 3 cspr for a transfer
    console.log("Pubkey: ", pubkey);
    const result = contract.callEntrypoint("transfer", args, pubkey, "casper-test", "3000000000", [], 10000000);
    const deployJson = DeployUtil.deployToJson(result);
    console.log("DeployJson: ", deployJson);
    Signer.sign(deployJson, activeKey).then((success) => {
        sendDeploy(success);
    }).catch((error) => {
        console.log(error);
    });
}

// account Hash helpers
function publicKeyBytes(hex_key){
    return CLPublicKey.fromHex(hex_key);
}
  
async function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}
  
async function getAccountHash(){
    const pubkey = await Signer.getActivePublicKey();
    const accountHash = publicKeyBytes(pubkey).toAccountHash();
    const parsed = toHexString(accountHash);
    return parsed;
}

// Send any signed Deploy to a webserver, no need to touch this function.
function sendDeploy(signedJson){
    console.log("Signed json: ", signedJson);
    axios.post("http://localhost:3000/sendDeploy", signedJson, {headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}}).then((response) => {
        const hash = response.data;
        console.log("Deploy Successful, Hash: ", hash);
    }).catch((error) => {
        console.log(error);
    });
} 


export {Mint, Transfer, getOwnedIds, getMetadata, getAccountHash};
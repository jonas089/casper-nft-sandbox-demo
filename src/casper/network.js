import axios from 'axios';
import { RuntimeArgs, CLValueBuilder, Contracts, CasperClient, DeployUtil, CLPublicKey, Signer, CLAccountHash } from 'casper-js-sdk';
import { cep78_contract_hash, node_addr } from './constants.js';


// General
async function getStatus(){
    const status = await Signer.isConnected();
    return status;
}


// Queries
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


// Deploys
// Pass account_hash as CLValue.
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
            //'{\"nft_name\":\"somename01\",\"nft_description\":\"somedescription01\",\"nft_url\":\"someurl01\"}'
    });
    const pubkey = CLPublicKey.fromHex(activeKey);
    const client = await new CasperClient(node_addr);
    const contract = new Contracts.Contract(client);
    contract.setContractHash(cep78_contract_hash);
    console.log("Contract: ", contract);
    // paying fixed fee of 3 cspr for a mint
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

// Send deploy to local axios server DON'T TOUCH !
function sendDeploy(signedJson){
    console.log("Signed json: ", signedJson);
    axios.post("http://localhost:3000/sendDeploy", signedJson, {headers: {'Content-Type': 'application/json','Access-Control-Allow-Origin': '*'}}).then((response) => {
        const hash = response.data;
        console.log("Deploy Successful, Hash: ", hash);
    }).catch((error) => {
        console.log(error);
    });
} 


export {Mint, Transfer, getOwnedIds, getMetadata, getStatus, getAccountHash};
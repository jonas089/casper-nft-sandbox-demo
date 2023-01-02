
# Get the latest version here: https://github.com/jonas089/VE-project/

# Deprecation
Please don't use this repository. I have built a much better version of this app that is available [here](https://github.com/jonas089/VE-project) using the latest React implementations. This repo is only kept alive to show my personal progress as a React-developer. Comparing this version to the latest one will show some of my personal progress in 2022.

# React Casper NFT Sandbox, an open source demo project to showcase the CEP-78 enhanced NFT Standard
**Please** make sure to read this entire documentation, as otherwise it will be extremely hard to use and modify this application. \
This app is an experimental platform built for educational purposes on the Casper Blockchain. \
Users can learn how to mint NFTs on Casper and use the Signer chrome extension, together with the Casper Block Explorer.

# Video tutorial series
[Workshop](https://youtube.com/playlist?list=PLq1atlGCXMqMgoMPKvMiA219LQXA_iPEI) on the Cep-78 NFT standard and Casper Sandbox application on Youtube.
Edit: In the second video, I made a mistake saying that the transfer function takes a hash identifier and an account-hash. To send tokens you should supply the hash identifier and the publickey. At the current state of the application, the Transfer button will be unresponsive when an account-hash, or anything other than a valid public key is supplied.

# Use the "App" Interface
## Mint
Input a name, description and any URL to an image on the web (e.g. .png, .jpg, ...). \
Then press "mint" and sign the transaction. \
Next, navigate to the "History" page and trace the transaction on the Explorer.

## Transfer
Input the hash-id of a Token (above the image in "Account" page) \
and a public key ( copy from the explorer ) as a "recipient". \
Press "Transfer" to send a token to another account. \
In the app, the public key will be converted to an account hash. \
All tokens are stored under a user's account hash.

# Milestones and Roadmap

**Latest Changes**

- Removed timeout and instead awaits the plugin to load

**October 2022**

- improve error handling / detect server errors and render a landing page. **Status: complete.**
- transaction history panel **Status: complete.**
- cleaner code **Status: in the works. trying to use more components and follow react best practice**

**November 2022**

- new loading screen
- design improvements

# Setup Guide
Requirements: React.js environment ( npm, node ... ), a browser that has the Casper-Signer plugin installed (e.g. Chromium, Brave ) \
I assume you know how to use the casper-client to deploy a smart contract and query an account / global state. \
=> Not sure how to query your account or install a contract? [Learn here](https://docs.casperlabs.io/dapp-dev-guide/) \

### 1. install dependencies
**root$** npm install
### 2. start the express server
**root$** cd src \
**src$** node server.js
### 3. run the react app
**root$** npm start

## Current functionality
- Mint NFTs through the Casper Signer, fixed fee of 3 CSPR - this can be changed on demand and should be changed in a production application.
- See the Hash IDs of Owned NFTs in the "Account" panel
- See all relevant metadata, aswell as a rendered image
- Transfer NFTs to other accounts
## Content
Javascript files are found in ./casper => constants.js (node address is specified here), \
controller.js (logic to sign deploys) \
server.js (an express webserver that sends deploys to the node to bypass cors error -> the app backend) \
lib.js (functions to monitor the state of the casper signer)

## Planned functionality
note: Multi Token standard not yet complete -> finish and open-source before implementing the following. \
- Support Multi-token Standard
- Manage multiple collections
## Post-release Design Goals
- Add Templates
- More responsive
- Efficient and clean design
- Multiple Nodes / algorithm to iterate node addresses
- Maintain
## Known issues
- a few non critical react warnings
- use of a deprecated react feature ( ReactDOM )
- re-fresh of page is required after unlocking / connecting the signer
- app does not detect a locked signer ( yet ) -> make sure the signer is unlocked and re-fresh if stuck on loading...
- no error visualized when accidentally using account-hash instead of public key with "transfer"


# The NFT Contract (CEP-78)
For this demo, the modalities of the NFT standard have been hardcoded and represent a digital NFT, whose metadata can not be modified. \
If you wish do dive deeper into modalities, checkout the [CEP-78](https://github.com/casper-ecosystem/cep-78-enhanced-nft) standard readme / documentation. \
If you are just getting started, install the custom contract from ./smart-contract/contract.wasm and query the contract-hash. You can change the contract hash of the NFT contract used by this app in \
./casper/constants.js, by updating the value "cep78_contract_hash". \
**Important**: When using the custom contract, you should be aware that you are using a version of the CEP-78 contract that has been modified to showcase an oversimplified version of an NFT on casper. \
This custom metadata scheme was specifically created for this demo application and is not an official standard scheme. \
Examples for non-custom, standard json schemes: ERC20(Casper&Ethereum), ERC721(Ethereum), CEP78(Casper). \
In a production application, you will not want to use this custom metadata scheme, with a metadata URI and an NFT backend instead of just a URL to an image on the web. \
Make sure you fully understand the readme of the [CEP-78](https://github.com/casper-ecosystem/cep-78-enhanced-nft) NFT standard before you proceed. \
The example smart contract for this demo app uses a custom metadata scheme: '{\"nft_name\":\"somename01\",\"nft_description\":\"somedescription01\",\"nft_url\":\"someurl01\"}'. \
Therefore, when deploying the example contract, one has to specifie the corresponding json_scheme modality \
to include all relevant metadata ( 3 parameters ):
When using the casper Client, the json_scheme has to be provided as an **escaped** json string: \

```
unescaped_json_scheme = {
   "properties":{
      "nft_name":{
         "name":"nft_name",
         "description":"name_of_nft",
         "required":true
      },
      "nft_description":{
         "name":"nft_description",
         "description":"description_of_nft",
         "required":true
      },
      "nft_name":{
         "name":"nft_url",
         "description":"url_of_nft",
         "required":true
      }
   }
}
```

Converted to a session-arg / escaped json string, this scheme looks like this:
```
'{\"properties\":{\"nft_name\":{\"name\":\"nft_name\",\"description\":\"name_of_nft\",\"required\":true},\"nft_description\":{\"name\":\"nft_description\",\"description\":\"description_of_nft\",\"required\":true},\"nft_name\":{\"name\":\"nft_url\",\"description\":\"url_of_nft\",\"required\":true}}}'
```
To do this conversion yourself, try [jsontostring](https://jsontostring.com/) \
Now you can deploy the compiled NFT contract with the custom json scheme: \

```
casper-client put-deploy --node-address NODE_ADDRESS \
 --chain-name CHAIN_NAME \
 --session-path PATH_TO_WASM \
 --secret-key PATH_TO_SECRET_KEY \
 --session-arg "name:string='NAME_OF_COLLECTION'" "symbol:string='SOME_SYMBOL'" "json_schema:string='{\"properties\":{\"nft_name\":{\"name\":\"nft_name\",\"description\":\"name_of_nft\",\"required\":true},\"nft_description\":{\"name\":\"nft_description\",\"description\":\"description_of_nft\",\"required\":true},\"nft_name\":{\"name\":\"nft_url\",\"description\":\"url_of_nft\",\"required\":true}}}'"
```

Once the deploy was successful, query the contract-hash using casper-client and update it in ./casper/constants.js \
That's it, now you have linked your own collection to a local instance of the demo NFT app. \
Congratulations!

### Additional notes
If you want to change the metadata schema, you also have to change the RuntimeArg in the Mint function in ./casper/controller.js. \
Keep in mind that this app was developed to showcase the integration of a Casper CEP-78 NFT collection in a React app and is not a mainnet project!

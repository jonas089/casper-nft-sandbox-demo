# Casper NFT Sandbox built with React
This app is an experimental platform built for educational purposes on the Casper Blockchain. Users can learn how to mint NFTs on Casper and use the Signer chrome extension, together with the Casper Block Explorer.

# Setup Guide
Requirements: React.js environment ( npm, node ... ), a browser that has the Casper-Signer plugin installed (e.g. Chromium, Brave )
## 0. install dependencies
root$ npm install
## 1. start the express server
$ cd src \
src$ node server.js
## 2. run the react app
root$ npm start


## Current functionality
- Mint NFTs through the Casper Signer, fixed fee of 3 CSPR
- See the Hash IDs of Owned NFTs in the "Account" panel
- See all relevant metadata, aswell as a rendered image
- Transfer NFTs to other accounts
## Future functionality
- Support Multi-token Standard 
- Manage multiple collections

## Design Goals
- Well designed Templates
- Good error handling and responsiveness
- Easy to use with good documentation
- Efficient and clean design
- Few to no React warnings


const express = require('express');
var cors = require('cors');
const { RuntimeArgs, CLValueBuilder, Contracts, CasperClient, DeployUtil, CLPublicKey, Signer } = require('casper-js-sdk');
const { node_addr, cep78_contract_hash } = require('./constants.js');
const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + 'public/static'));
app.listen(port, () => {
  console.log(`Sandbox backend listening at http://localhost:${port}`)
});

app.post('/getOwnedIds', async (req, res) => {
  //const client = await new CasperClient(node_addr);
  const account_hash = req.body.account_hash;
  const client = await new CasperClient(node_addr);
  let owned = [];
  var product_contract = new Contracts.Contract(client);
  product_contract.setContractHash(cep78_contract_hash);
  const result = await product_contract.queryContractDictionary(
    "owned_tokens", // hardcoded as part of NFT standard.
    account_hash
  ).then(response => {
    console.log("RESPONSE getOwnedIds: ", response);
    for (let i = 0; i < response.data.length; i++){
      owned.push(response.data[i].data);
    };
    return owned;
  }).catch(error => {
    const e = "Failed to find base key at path"
    if (error.toString().includes(e.toString())) {
      console.log("Account does not own any tokens");
    }
    else{
      console.log(error);
    }
    return []
  })
  await res.send(owned);
})

app.post('/metadata', async(req, res) => {
  const client = await new CasperClient(node_addr);
  var product_contract = new Contracts.Contract(client);
  product_contract.setContractHash(cep78_contract_hash);
  const list = req.body.list;
  let meta = [];
  for (item in list) {
    console.log("Item is: ", list[item].toString());
    await product_contract.queryContractDictionary(
      "metadata_custom_validated",
      list[item]
    ).then(response => {
      meta.push(response.data);
    }).catch(error => {
      console.log(error);
    })
  }
  await res.send(meta);
})


app.post('/sendDeploy', (req, res) => {
  const signedJson = req.body;
  console.log(signedJson);
  let signedDeploy = DeployUtil.deployFromJson(signedJson).unwrap();
  console.log("SignedDeploy: ", signedDeploy);
  signedDeploy.send(node_addr).then((response) => {
      res.send(response);
      return;
  }).catch((error) => {
      console.log(error);
      return;
  });;
});
const { CLPublicKey } = require('casper-js-sdk');
// Key-Related
function toHexString(byteArray) {
    return Array.from(byteArray, function(byte) {
    return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}
function publicKeyBytes(hex_key){
    return CLPublicKey.fromHex(hex_key);
}

// Other
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export {toHexString, publicKeyBytes, sleep};
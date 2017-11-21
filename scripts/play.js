
var ethers = require('ethers')
// let Web3 = require('web3')
// let web3 = new Web3()
let httpProvider = 'https://chain.paratii.video'
let network = {
  name: 'paratii-parity',
  chainId: 1
}

let provider = new ethers.providers.JsonRpcProvider(httpProvider, network)
console.log(provider)
// web3.setProvider(new web3.providers.HttpProvider(httpProvider))

var address = '0x00671C1B3Fb5389e8Ed5c538e5Ba05f29490cFC8'
console.log('Address: ', address)
// get the current balance
provider.getBalance(address).then(function (balance) {
    // balance is a BigNumber (in wei); format is as a sting (in ether)
  var etherString = ethers.utils.formatEther(balance)
  console.log('Balance in ETH: ' + etherString)
})

// create a wallet

var mnemonic = 'right april squirrel rain episode since exit cost cave outside clip danger'
let wallet = ethers.Wallet.fromMnemonic(mnemonic)
console.log('Address fom mnemonic: ' + wallet.address)
let data = {
  'id': '998b6e2e-317f-141d-5bad-048537a3df5b',
  'version': 3,
  'crypto': {
    'cipher': 'aes-128-ctr',
    'cipherparams': {'iv': '47cfdbd59cb838cdcda706fe34233874'},
    'ciphertext': '78375367a89e359a2f14d7fe6173439f9a8f8b57b37c5858df1d56f8c7d2f2f6',
    'kdf': 'pbkdf2',
    'kdfparams': {'c': 10240, 'dklen': 32, 'prf': 'hmac-sha256', 'salt': 'bfcef87cfac709406872b9f3449823d95649fb92887b379f7f5da5436bd2ec9f'},
    'mac': '32064e32d12e7d61a992c7f4b1782d22048fff351db93d973d9f8944a92d9920'},
  'address': '00671c1b3fb5389e8ed5c538e5ba05f29490cfc8',
  'name': 'Jelles Paratii Account',
  'meta': '{"passwordHint":"x","timestamp":1510747293125}'}

var json = JSON.stringify(data)
var password = 'vJLwVtta6jCpEXtR'
ethers.Wallet.fromEncryptedWallet(json, password).then(function (wallet) {
  wallet.provider = provider
  console.log('Address: ' + wallet.address)
  console.log('now sending 12 WEI to 0x00a329c0648769A73afAc7F9381E08FB43dBEA72')
  wallet.send('0x00a329c0648769A73afAc7F9381E08FB43dBEA72', 12)
})

console.log(wallet)
// console.log(wallet.getAddress())
console.log('done')

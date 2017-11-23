let ethers = require('ethers')
let settings = require('./settings.js')
let provider = settings.provider
// let httpProvider = 'https://chain.paratii.video'
// web3.setProvider(new web3.providers.HttpProvider(httpProvider))

// var address = '0x00671C1B3Fb5389e8Ed5c538e5Ba05f29490cFC8'
let address = settings.paratiiOwnerAccount
console.log('Address: ', address)

// get the current balance
provider.getBalance(address).then(function (balance) {
    // balance is a BigNumber (in wei); format is as a sting (in ether)
  var etherString = ethers.utils.formatEther(balance)
  console.log('Balance in ETH: ' + etherString)
})

// create a wallet

// let wallet = ethers.Wallet.fromMnemonic(mnemonic)
// console.log('Address fom mnemonic: ' + wallet.address)

let walletData = require('../secrets/2fee194f-6d3b-4ba4-2d9a-0e17c944d623.json')
let fs = require('fs')
let passwordFile = './secrets/2fee194f-6d3b-4ba4-2d9a-0e17c944d623-password.txt'
fs.readFile(passwordFile, 'ascii', function (err, password) {
  if (err) { throw err }
  password = password.trim()
  // console.log(`"${password}"`)
  var walletJson = JSON.stringify(walletData)
  ethers.Wallet.fromEncryptedWallet(walletJson, password).then(function (wallet) {
    wallet.provider = provider
    console.log('Wallet Address: ' + wallet.address)
    provider.getBalance(wallet.address).then(function (balance) {
      // balance is a BigNumber (in wei); format is as a sting (in ether)
      var etherString = ethers.utils.formatEther(balance)
      console.log(`Balance of ${wallet.address}: ${etherString}`)
    }, function (error) { throw error })

    console.log('now sending 12 WEI to 0x00a329c0648769A73afAc7F9381E08FB43dBEA72')
    wallet.send('0x00a329c0648769A73afAc7F9381E08FB43dBEA72', 12)
  })

// console.log(wallet)
// console.log(wallet.getAddress())
  console.log('done')
})

require('babel-polyfill')
require('babel-register')({
  'presets': ['es2015'],
  'plugins': ['syntax-async-functions', 'transform-regenerator']
})
var ethers = require('ethers')
// let httpProvider = 'https://chain.paratii.video'
let httpProvider = 'http://127.0.0.1:8545'

let network = {
  name: 'paratii-parity',
  chainId: 0
}

module.exports.provider = new ethers.providers.JsonRpcProvider(httpProvider, network)

module.exports.paratiiOwnerAccount = '0x000e122e55D6a26912aa2698BfB2fB4E7913e9Bf'

// TODO: web3 should be phased out from the lib,a nd the next lines should not be necessary anymore

module.exports.web3 = require('../lib/web3.js').web3
module.exports.web3.setProvider(httpProvider)

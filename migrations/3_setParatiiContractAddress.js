var ParatiiToken = artifacts.require('./ParatiiToken.sol')
var ParatiiAvatar = artifacts.require('./ParatiiAvatar.sol')
var ParatiiRegistry = artifacts.require('./ParatiiRegistry.sol')
var SendEther = artifacts.require('./SendEther.sol')
var VideoRegistry = artifacts.require('./VideoRegistry.sol')
var VideoStore = artifacts.require('./VideoStore.sol')

module.exports = async function (deployer) {
  let paratiiRegistry = await ParatiiRegistry.deployed()

  paratiiRegistry.registerContract('ParatiiToken', '0x385b2E03433C816DeF636278Fb600ecd056B0e8d')
}

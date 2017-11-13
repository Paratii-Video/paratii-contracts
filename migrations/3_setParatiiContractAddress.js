var ParatiiRegistry = artifacts.require('./ParatiiRegistry.sol')

module.exports = async function (deployer) {
  let paratiiRegistry = await ParatiiRegistry.deployed()

  paratiiRegistry.registerAddress('ParatiiToken', '0x385b2E03433C816DeF636278Fb600ecd056B0e8d')
}

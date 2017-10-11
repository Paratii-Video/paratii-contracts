var ParatiiToken = artifacts.require('./ParatiiToken.sol')
var ParatiiAvatar = artifacts.require('./ParatiiAvatar.sol')
var ParatiiRegistry = artifacts.require('./ParatiiRegistry.sol')
var SendEther = artifacts.require('./SendEther.sol')
var VideoRegistry = artifacts.require('./VideoRegistry.sol')
var VideoStore = artifacts.require('./VideoStore.sol')

module.exports = async function (deployer) {
  console.log('deploying contracts')
  await deployer.deploy(ParatiiRegistry)
  let paratiiRegistry = await ParatiiRegistry.deployed()

  await deployer.deploy(ParatiiAvatar, paratiiRegistry.address)
  let paratiiAvatar = await ParatiiAvatar.deployed()
  await deployer.deploy(ParatiiToken)
  let paratiiToken = await ParatiiToken.deployed()
  await deployer.deploy(SendEther)
  let sendEther = await SendEther.deployed()
  await deployer.deploy(VideoRegistry)
  let videoRegistry = await VideoRegistry.deployed()
  await deployer.deploy(VideoStore, paratiiRegistry.address)
  let videoStore = await VideoStore.deployed()
  paratiiRegistry.registerAddress('ParatiiAvatar', paratiiAvatar.address)
  paratiiRegistry.registerAddress('ParatiiToken', paratiiToken.address)
  paratiiRegistry.registerAddress('SendEther', sendEther.address)
  paratiiRegistry.registerAddress('VideoRegistry', videoRegistry.address)
  paratiiRegistry.registerAddress('VideoStore', videoStore.address)
  // give 30 percent of each video to the redistribution pool
  paratiiRegistry.registerUint('VideoRedistributionPoolShare', 30 * 10 ** 18)
  paratiiAvatar.addToWhitelist(videoStore.address)

}

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
  paratiiRegistry.registerContract('ParatiiAvatar', paratiiAvatar.address)
  paratiiRegistry.registerContract('ParatiiToken', paratiiToken.address)
  paratiiRegistry.registerContract('SendEther', sendEther.address)
  paratiiRegistry.registerContract('VideoRegistry', videoRegistry.address)
  paratiiRegistry.registerContract('VideoStore', videoStore.address)
  // give 30 percent of each video to the redistribution pool
  paratiiRegistry.registerUint('VideoRedistributionPoolShare', 30 * 10 ** 18)
  paratiiAvatar.addToWhitelist(videoStore.address)

}

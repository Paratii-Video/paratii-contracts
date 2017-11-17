
const ParatiiRegistry = artifacts.require('./ParatiiRegistry')
const ParatiiAvatar = artifacts.require('./ParatiiAvatar')
const ParatiiToken = artifacts.require('./ParatiiToken')
const SendEther = artifacts.require('./SendEther')
const UserRegistry = artifacts.require('./UserRegistry')
const VideoRegistry = artifacts.require('./VideoRegistry')
const VideoStore = artifacts.require('./VideoStore')
export const NULL_HASH = '0x0000000000000000000000000000000000000000'

export let paratiiRegistry, paratiiAvatar, paratiiToken, sendEther, userRegistry, videoRegistry, videoStore

export async function expectError (f) {
  // let expectedErrorMsg = 'Error: VM Exception while processing transaction: invalid opcode'
  // let expectedErrorMsg = 'Error: VM Exception while processing transaction: revert'

  try {
    await f()
  } catch (err) {
    // assert.equal(String(err), expectedErrorMsg)
    return
  }

  let msg = `Expected an error - function executed without error instead`
  throw Error(msg)
}

export async function setupParatiiContracts () {
  // TODO: refactor this and use Paratii.getOrDeployContracts()
  paratiiRegistry = await ParatiiRegistry.new()

  paratiiToken = await ParatiiToken.new()
  paratiiRegistry.registerAddress('ParatiiToken', paratiiToken.address)

  sendEther = await SendEther.new()
  paratiiRegistry.registerAddress('SendEther', sendEther.address)

  videoRegistry = await VideoRegistry.new(paratiiRegistry.address)
  paratiiRegistry.registerAddress('VideoRegistry', videoRegistry.address)

  paratiiAvatar = await ParatiiAvatar.new(paratiiRegistry.address)
  paratiiRegistry.registerAddress('ParatiiAvatar', paratiiAvatar.address)

  userRegistry = await UserRegistry.new(paratiiRegistry.address)
  paratiiRegistry.registerAddress('UserRegistry', userRegistry.address)

  videoStore = await VideoStore.new(paratiiRegistry.address)
  paratiiRegistry.registerAddress('VideoStore', videoStore.address)

  // give 30 percent of eah video to the redistribution pool
  paratiiRegistry.registerUint('VideoRedistributionPoolShare', web3.toWei(0.3))

  paratiiAvatar.addToWhitelist(videoStore.address)
  return paratiiRegistry
}

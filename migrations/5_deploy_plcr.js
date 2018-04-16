/* global artifacts */

const ParatiiToken = artifacts.require('./paratii/ParatiiToken.sol')
const DLL = artifacts.require('dll/DLL.sol')
const AttributeStore = artifacts.require('attrstore/AttributeStore.sol')
const PLCRVoting = artifacts.require('./tcr/PLCRVoting.sol')
// const Registry = artifacts.require('./paratii/Registry.sol')

module.exports = (deployer, network, accounts) => {
  async function approvePLCRFor (addresses) {
    const token = await ParatiiToken.deployed()
    const user = addresses[0]
    const balanceOfUser = await token.balanceOf(user)
    await token.approve(PLCRVoting.address, balanceOfUser, { from: user })
    if (addresses.length === 1) { return true }
    return approvePLCRFor(addresses.slice(1))
  }

  deployer.link(DLL, PLCRVoting)
  deployer.link(AttributeStore, PLCRVoting)

  return deployer.then(async () => {
    let paratiiToken = await ParatiiToken.deployed()
    let tokenAddress = paratiiToken.address
    console.log('2nd ParatiiToken Address: ', tokenAddress)
    return deployer.deploy(
      PLCRVoting,
      tokenAddress
    )
  })
    .then(async () => {
      if (network === 'test') {
        await approvePLCRFor(accounts)
      }
    }).catch((err) => { console.log('deploy_plcr Err'); throw err })
}

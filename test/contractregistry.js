import { getAddressFromLogs, NULL_HASH } from './utils.js'
const ParatiiRegistry = artifacts.require('./ParatiiRegistry')
const ParatiiToken = artifacts.require('./ParatiiToken')

contract('ParatiiRegistry', function (accounts) {
  let videoInfo

  it('should register a contract', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let paratiiToken = await ParatiiToken.new()
    let contractName = 'ParatiiToken'
    let tx = await paratiiRegistry.register(contractName, paratiiToken.address)
    assert.equal(getAddressFromLogs(tx, '_address'), paratiiToken.address)
    // assert.equal(getAddressFromLogs(tx, '_name'), paddedHash)

    videoInfo = await paratiiRegistry.getAddress(contractName)
    assert.equal(videoInfo, paratiiToken.address)

    await paratiiRegistry.unregister(contractName)
    videoInfo = await paratiiRegistry.contracts(contractName)
    assert.equal(videoInfo, NULL_HASH)
  })

  it('only owner can unregister a video [TODO]', async function () {
  })
})

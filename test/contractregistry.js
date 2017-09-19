import { getValueFromLogs, NULL_HASH } from './utils.js'
var ContractRegistry = artifacts.require('./ContractRegistry')
var ParatiiToken = artifacts.require('./ParatiiToken')

contract('ContractRegistry', function (accounts) {
  let videoInfo

  it('should register a contract', async function () {
    let contractRegistry = await ContractRegistry.new()
    let paratiiToken = await ParatiiToken.new()
    let contractName = 'ParatiiToken'
    let tx = await contractRegistry.register(contractName, paratiiToken.address)
    assert.equal(getValueFromLogs(tx, '_address'), paratiiToken.address)
    // assert.equal(getValueFromLogs(tx, '_name'), paddedHash)

    videoInfo = await contractRegistry.contractAddress(contractName)
    assert.equal(videoInfo, paratiiToken.address)

    await contractRegistry.unregister(contractName)
    videoInfo = await contractRegistry.contracts(contractName)
    assert.equal(videoInfo, NULL_HASH)
  })

  it('only ownwer can unregister a video [TODO]', async function () {
  })
})

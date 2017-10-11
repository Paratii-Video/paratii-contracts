import { getInfoFromLogs, NULL_HASH, expectError } from './utils.js'
const ParatiiRegistry = artifacts.require('./ParatiiRegistry')
const ParatiiToken = artifacts.require('./ParatiiToken')

contract('ParatiiRegistry', function (accounts) {
  let videoInfo
  let contractName = 'ParatiiToken'

  it('should register a contract', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let paratiiToken = await ParatiiToken.new()
    let tx = await paratiiRegistry.registerContract(contractName, paratiiToken.address)
    assert.equal(getInfoFromLogs(tx, '_address'), paratiiToken.address)

    videoInfo = await paratiiRegistry.getContract(contractName)
    assert.equal(videoInfo, paratiiToken.address)

    await paratiiRegistry.unregisterContract(contractName)
    videoInfo = await paratiiRegistry.getContract(contractName)
    assert.equal(videoInfo, NULL_HASH)
  })

  it('a non-owner of the registry can not register a contract', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let paratiiToken = await ParatiiToken.new()
    await expectError(async function() {
       await paratiiRegistry.registerContract(contractName, paratiiToken.address, {from: web3.eth.accounts[1]})
    })
  })

  it('a non-owner of the registry can not unregister a contract', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let paratiiToken = await ParatiiToken.new()
    await paratiiRegistry.registerContract(contractName, paratiiToken.address)
    await expectError(async function() {
       await paratiiRegistry.unregisterContract(contractName, {from: web3.eth.accounts[1]})
    })
  })

  it('should register a number', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let numberName = 'this-is-a-setting'
    let number = 1413
    let numberFromContract
    let tx

    tx = await paratiiRegistry.registerNumber(numberName, number)
    assert.equal(getInfoFromLogs(tx, '_number'), number)

    numberFromContract = await paratiiRegistry.getNumber(numberName)
    assert.equal(numberFromContract, number)

    await paratiiRegistry.unregisterNumber(numberName)
    numberFromContract = await paratiiRegistry.getNumber(numberName)
    assert.equal(numberFromContract, 0)
  })

  it('a non-owner of the registry can not register a number', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let numberName = 'this-is-a-setting'
    let number = 1413
    await expectError(async function() {
       await paratiiRegistry.registerNumber(numberName, number, {from: web3.eth.accounts[1]})
    })
  })

  it('a non-owner of the registry can not unregister a number', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let numberName = 'this-is-a-setting'
    let number = 1413
    await paratiiRegistry.registerNumber(numberName, number)
    await expectError(async function() {
       await paratiiRegistry.unregisterNumber(numberName, {from: web3.eth.accounts[1]})
    })
  })
})

import { NULL_HASH, expectError, getInfoFromLogs } from './utils.js'
const ParatiiRegistry = artifacts.require('./ParatiiRegistry')
const ParatiiToken = artifacts.require('./ParatiiToken')

contract('ParatiiRegistry', function (accounts) {
  let videoInfo
  let contractName = 'ParatiiToken'
  let tx

  it('should register a contract', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let paratiiToken = await ParatiiToken.new()
    tx = await paratiiRegistry.registerAddress(contractName, paratiiToken.address)
    assert.equal(getInfoFromLogs(tx, '_name', 'LogRegisterAddress'), contractName)
    assert.equal(getInfoFromLogs(tx, '_address', 'LogRegisterAddress'), paratiiToken.address)

    videoInfo = await paratiiRegistry.getContract(contractName)
    assert.equal(videoInfo, paratiiToken.address)

    await paratiiRegistry.unregisterAddress(contractName)
    assert.equal(getInfoFromLogs(tx, '_name', 'LogUnregisterAddress'), contractName)
    videoInfo = await paratiiRegistry.getContract(contractName)
    assert.equal(videoInfo, NULL_HASH)
  })

  it('a non-owner of the registry can not register a contract', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let paratiiToken = await ParatiiToken.new()
    await expectError(async function () {
      await paratiiRegistry.registerAddress(contractName, paratiiToken.address, {from: web3.eth.accounts[1]})
    })
  })

  it('a non-owner of the registry can not unregister a contract', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let paratiiToken = await ParatiiToken.new()
    await paratiiRegistry.registerAddress(contractName, paratiiToken.address)
    await expectError(async function () {
      await paratiiRegistry.unregisterAddress(contractName, {from: web3.eth.accounts[1]})
    })
  })

  it('should register a number', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let numberName = 'this-is-a-setting'
    let number = 1413
    let numberFromContract

    tx = await paratiiRegistry.registerUint(numberName, number)
    assert.equal(getInfoFromLogs(tx, '_name', 'LogRegisterUint'), numberName)
    assert.equal(getInfoFromLogs(tx, '_number', 'LogRegisterUint'), number)

    numberFromContract = await paratiiRegistry.getUint(numberName)
    assert.equal(numberFromContract, number)

    tx = await paratiiRegistry.unregisterUint(numberName)
    assert.equal(getInfoFromLogs(tx, '_name', 'LogUnregisterUint'), numberName)
    numberFromContract = await paratiiRegistry.getUint(numberName)
    assert.equal(numberFromContract, 0)
  })

  it('a non-owner of the registry can not register a number', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let numberName = 'this-is-a-setting'
    let number = 1413
    await expectError(async function () {
      await paratiiRegistry.registerUint(numberName, number, {from: web3.eth.accounts[1]})
    })
  })

  it('a non-owner of the registry can not unregister a number', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let numberName = 'this-is-a-setting'
    let number = 1413
    await paratiiRegistry.registerUint(numberName, number)
    await expectError(async function () {
      await paratiiRegistry.unregisterUint(numberName, {from: web3.eth.accounts[1]})
    })
  })

  it('should register a string', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let stringName = 'this-is-a-setting'
    let string = 'some kind of string'
    let stringFromContract

    tx = await paratiiRegistry.registerString(stringName, string)
    assert.equal(getInfoFromLogs(tx, '_name', 'LogRegisterString'), stringName)
    assert.equal(getInfoFromLogs(tx, '_string', 'LogRegisterString'), string)

    stringFromContract = await paratiiRegistry.getString(stringName)
    assert.equal(stringFromContract, string)

    tx = await paratiiRegistry.unregisterString(stringName)
    assert.equal(getInfoFromLogs(tx, '_name', 'LogUnregisterString'), stringName)
    stringFromContract = await paratiiRegistry.getString(stringName)
    assert.equal(stringFromContract, 0)
  })

  it('a non-owner of the registry can not register a string', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let stringName = 'this-is-a-setting'
    let string = 'some kind of string'
    await expectError(async function () {
      await paratiiRegistry.registerString(stringName, string, {from: web3.eth.accounts[1]})
    })
  })

  it('a non-owner of the registry can not unregister a string', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let stringName = 'this-is-a-setting'
    let string = 'some kind of string'
    await paratiiRegistry.registerString(stringName, string)
    await expectError(async function () {
      await paratiiRegistry.unregisterString(stringName, {from: web3.eth.accounts[1]})
    })
  })
})

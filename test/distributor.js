import {
  setupParatiiContracts,
  ptiDistributor,
  paratiiToken,
  getInfoFromLogs,
  expectError
} from './utils.js'

var ethUtil = require('ethereumjs-util')
var Web3Utils = require('web3-utils')

contract('Distributor', function (accounts) {
  let address = accounts[2]
  let owner = accounts[0]
  const amount = 5 ** 18
  const reason = 'email_verification'
  const salt = web3.sha3(Date.now())
  const hash = Web3Utils.soliditySha3('' + address, '' + amount, '' + salt, '' + reason)
  const hash2 = Web3Utils.soliditySha3(address, amount, salt, reason)
  const hash3 = Web3Utils.soliditySha3({type: 'address', value: address}, {type: 'uint256', value: amount}, {type: 'uint256', value: salt}, {type: 'string', value: reason})

  before(async function () {
    await setupParatiiContracts()
    await paratiiToken.transfer(ptiDistributor.address, 1 * 10 ** 18)
  })

  // this test is inspired from https://github.com/davidmichaelakers/ecrecover/ TY!
  it('checkOwner: Signed messages should return signing address', async function () {
    const messagetoSign = web3.sha3('Message to sign here.')
    let messagetoSend = messagetoSign

    const unlockedAccount = accounts[0]
    var signature = await web3.eth.sign(unlockedAccount, messagetoSign)

    const signatureData = ethUtil.fromRpcSig(signature)
    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)

    const recoveredAddress = await ptiDistributor.checkOwner(messagetoSend, v, r, s)
    assert.equal(recoveredAddress, accounts[0])
  })

  it('the contract distribute function should work as expected', async function () {
    let checkHashing = await ptiDistributor.checkHashing(address, amount, salt, reason)

    assert.equal(getInfoFromLogs(checkHashing, '_hashing', 'LogDebug'), hash3)
    assert.equal(getInfoFromLogs(checkHashing, '_hashing', 'LogDebug'), hash2)
    assert.equal(getInfoFromLogs(checkHashing, '_hashing', 'LogDebug'), hash)

    // check hashing packed

    const signature = await web3.eth.sign(owner, hash)

    const signatureData = ethUtil.fromRpcSig(signature)
    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)

    let checkOwnerPacked = await ptiDistributor.checkOwnerPacked(address, amount, salt, reason, v, r, s)
    assert.equal(getInfoFromLogs(checkOwnerPacked, '_owner', 'LogDebugOwner'), owner)

    // check distributing
    let distribute = await ptiDistributor.distribute(address, amount, salt, reason, v, r, s)
    console.log(distribute.logs)
    assert.equal(getInfoFromLogs(distribute, '_toAddress', 'LogDistribute'), address)
    assert.equal(getInfoFromLogs(distribute, '_amount', 'LogDistribute'), amount)
    assert.equal(getInfoFromLogs(distribute, '_reason', 'LogDistribute'), reason)
  })

  it.skip('TBI: the contract distributeTransferable function should work as expected', async function () {
    // check hashing
    const salt = web3.sha3(Date.now())

    const hashTransferable = Web3Utils.soliditySha3('' + amount, '' + salt, '' + reason)

    const signature = await web3.eth.sign(owner, hashTransferable)

    const signatureData = ethUtil.fromRpcSig(signature)
    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)

    let distribute = await ptiDistributor.distributeTransferable(address, amount, salt, reason, v, r, s)
    console.log(distribute.logs)
    assert.equal(getInfoFromLogs(distribute, '_toAddress', 'LogDistributeTransferable'), address)
    assert.equal(getInfoFromLogs(distribute, '_amount', 'LogDistributeTransferable'), amount)
    assert.equal(getInfoFromLogs(distribute, '_reason', 'LogDistributeTransferable'), reason)
  })

  it('the contract should failed if transaction is sent twice', async function () {
    const signature = await web3.eth.sign(owner, hash)
    const signatureData = ethUtil.fromRpcSig(signature)
    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)

    await expectError(async function () {
      await ptiDistributor.distribute(address, amount, salt, reason, v, r, s)
    })
  })

  it('the contract should failed if transaction is sent with wrong amount', async function () {
    const signature = await web3.eth.sign(owner, hash)
    const signatureData = ethUtil.fromRpcSig(signature)
    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)

    await expectError(async function () {
      await ptiDistributor.distribute(address, amount + 1, salt, v, r, s)
    })
  })

  it('the contract should failed if transaction is sent with wrong salt', async function () {
    const signature = await web3.eth.sign(owner, hash)
    const signatureData = ethUtil.fromRpcSig(signature)

    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)
    await expectError(async function () {
      await ptiDistributor.distribute(address, amount, 2, v, r, s)
    })
  })

  it('the contract should failed if transaction is sent with wrong reason', async function () {
    const signature = await web3.eth.sign(owner, hash)
    const signatureData = ethUtil.fromRpcSig(signature)

    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)
    await expectError(async function () {
      await ptiDistributor.distribute(address, amount, salt, 'wrong_reason', v, r, s)
    })
  })
})

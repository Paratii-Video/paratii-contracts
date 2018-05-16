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
  const salt = Date.now()
  const hash = Web3Utils.soliditySha3('' + amount, '' + salt)
  const hash2 = Web3Utils.soliditySha3(amount, salt)
  const hash3 = Web3Utils.soliditySha3({type: 'uint256', value: amount}, {type: 'uint256', value: salt})

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

  it('the contract should work as expected', async function () {
    // check hashing

    let checkHashing = await ptiDistributor.checkHashing(amount, salt)

    assert.equal(getInfoFromLogs(checkHashing, '_hashing', 'LogDebug'), hash3)
    assert.equal(getInfoFromLogs(checkHashing, '_hashing', 'LogDebug'), hash2)
    assert.equal(getInfoFromLogs(checkHashing, '_hashing', 'LogDebug'), hash)

    // check hashing packed

    const signature = await web3.eth.sign(owner, hash)

    const signatureData = ethUtil.fromRpcSig(signature)
    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)

    let checkOwnerPacked = await ptiDistributor.checkOwnerPacked(amount, salt, v, r, s)
    assert.equal(getInfoFromLogs(checkOwnerPacked, '_owner', 'LogDebugOwner'), owner)

    // check distributing
    let distribute = await ptiDistributor.distribute(address, amount, salt, v, r, s)
    assert.equal(getInfoFromLogs(distribute, '_toAddress', 'LogDistribute'), address)
  })

  it('the contract should failed if transaction is sent twice', async function () {
    const signature = await web3.eth.sign(owner, hash)
    const signatureData = ethUtil.fromRpcSig(signature)
    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)

    await expectError(async function () {
      await ptiDistributor.distribute(address, amount, salt, v, r, s)
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
    console.log(amount)
    console.log('real salt', salt)
    console.log('fake salt', salt + 2)
    console.log(hash)
    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)
    await expectError(async function () {
      await ptiDistributor.distribute(address, amount, 2, v, r, s)
    })
  })
})

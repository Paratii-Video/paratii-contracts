import {
  setupParatiiContracts,
  ptiDistributor,
  paratiiToken,
  getInfoFromLogs
} from './utils.js'
var ethUtil = require('ethereumjs-util')
var uuidv1 = require('uuid/v1')

contract('Distributor: ', function (accounts) {
  let address = accounts[2]
  let owner = accounts[0]
  const amount = 1 * 10 ** 18
  const nonce = uuidv1()

  before(async function () {
    await setupParatiiContracts()
    await paratiiToken.transfer(ptiDistributor.address, 1 * 10 ** 18)
  })

  // this test is inspired from https://github.com/davidmichaelakers/ecrecover/ TY!

  it('the contract should work as expected', async function () {
    let messagetoSign = ethUtil.bufferToHex(Buffer.alloc(nonce.length, nonce))
    let messagetoSend
    let hashBuff
    let msgHashBuff

    switch (this.nodeVersion) {
      default:
        hashBuff = ethUtil.toBuffer(nonce)
        msgHashBuff = ethUtil.hashPersonalMessage(hashBuff)
        messagetoSend = ethUtil.bufferToHex(msgHashBuff)
        break
    }

    var signature = await web3.eth.sign(owner, messagetoSign)

    console.log(this.nodeVersion)
    console.log(this.nodeVersion + ' sig: ' + signature)
    console.log(this.nodeVersion + ' msg2sign: ' + messagetoSign)
    console.log(this.nodeVersion + ' msg2send: ' + messagetoSend)
    console.log()
    console.log()

    const signatureData = ethUtil.fromRpcSig(signature)
    let v = ethUtil.bufferToHex(signatureData.v)
    let r = ethUtil.bufferToHex(signatureData.r)
    let s = ethUtil.bufferToHex(signatureData.s)

    let distribute = await ptiDistributor.distribute(address, amount, messagetoSend, v, r, s)
    console.log(distribute.logs)
    console.log(owner)
    assert.equal(getInfoFromLogs(distribute, '_toAddress', 'LogDistribute'), accounts[2])
  })
})

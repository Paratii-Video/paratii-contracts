var TcrPlaceholder = artifacts.require('./TcrPlaceholder.sol')
import {
  getInfoFromLogs,
  paratiiToken,
  tcrPlaceholder,
  setupParatiiContracts,
  fastForward
} from './utils.js'

contract('TcrPlaceholder', function (accounts) {
  let videoId = 'videoid_test123'

  before(async function () {
    await setupParatiiContracts()
    await paratiiToken.transfer(accounts[1], 1000)
  })

  it('the contract should have 5 minDeposit', async function () {
    let minDeposit = await tcrPlaceholder.getMinDeposit()
    assert.equal(minDeposit, 5)
  })

  it('the client should be able to apply for TCR', async function () {
    let amount = 10
    let balance = await paratiiToken.balanceOf(accounts[1])
    assert.equal(balance.toNumber(), 1000)
    await paratiiToken.approve(tcrPlaceholder.address, 100, {from: accounts[1]})
    let allowance = await paratiiToken.allowance(accounts[1], tcrPlaceholder.address)
    assert.equal(allowance, 100)

    let tx = await tcrPlaceholder.apply(videoId, amount, {from: accounts[1]})
    assert.equal(getInfoFromLogs(tx, 'videoId', '_Application'), videoId)
    assert.equal(getInfoFromLogs(tx, 'deposit', '_Application'), amount)
  })

  it('fastForward 101 blocks & updateStatus', (done) => {
    let startingBlock = web3.eth.blockNumber
    fastForward(101, async (err, result) => {
      assert.isNull(err)
      assert.isOk(result)
      assert.equal(startingBlock + 101 , web3.eth.blockNumber)

      let tx = await tcrPlaceholder.updateStatus(videoId, {from: accounts[1]})

      assert.isOk(tx)
      assert.equal(getInfoFromLogs(tx, 'videoId', '_NewVideoWhitelisted'), videoId)
      let isWhitelisted = await tcrPlaceholder.isWhitelisted(videoId)
      assert.isOk(isWhitelisted)
      done()
    })
  })

})

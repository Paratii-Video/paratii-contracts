import {
  sales,
  getInfoFromLogs,
  setupParatiiContracts
} from './utils.js'

contract('Sales contract:', function (accounts) {
  let videoId = 'some-id'

  beforeEach(async function () {
    await setupParatiiContracts()
  })
  it('should work as expected', async function () {
    // accounts[0] is the owner of the sales contract
    assert.equal(await sales.owner(), accounts[0])

    //
    assert.equal(await sales.userBoughtVideo(videoId, accounts[1]), false)
    // the owner can register the buying of the video
    let tx = await sales.registerSale(videoId, accounts[1], 10e14)
    assert.equal(getInfoFromLogs(tx, '_videoId', 'LogRegisterSale'), videoId)
    assert.equal(getInfoFromLogs(tx, '_buyer', 'LogRegisterSale'), accounts[1])

    assert.equal(await sales.userBoughtVideo(videoId, accounts[1]), true)
  })

  it('should be possible to "buy" a video with a price of 0', async function () {
    let tx = await sales.registerSale(videoId, accounts[1], 0)
    assert.equal(getInfoFromLogs(tx, '_price', 'LogRegisterSale'), 0)
  })
})

import {
  getInfoFromLogs,
  expectError,
  paratiiRegistry,
  sales,
  setupParatiiContracts
} from './utils.js'

contract('Sales contract:', function (accounts) {
  let tx
  let videoId = 'some-id'
  let price = 10e14
  let buyer = accounts[1]
  let ipfsData = 'abcdefg'

  beforeEach(async function () {
    await setupParatiiContracts()
  })

  it('should work as expected', async function () {
    // accounts[0] is the owner of the sales contract
    assert.equal(await sales.owner(), accounts[0])
    //
    assert.equal(await sales.userBoughtVideo(buyer, videoId), false)
    // the owner can register the buying of the video
    tx = await sales.create(buyer, videoId, price, ipfsData)
    assert.equal(getInfoFromLogs(tx, '_videoId', 'LogCreateSale'), videoId)
    assert.equal(getInfoFromLogs(tx, '_buyer', 'LogCreateSale'), buyer)
    assert.equal(getInfoFromLogs(tx, '_price', 'LogCreateSale'), price)
    assert.equal(getInfoFromLogs(tx, '_ipfsData', 'LogCreateSale'), ipfsData)

    assert.equal(await sales.userBoughtVideo(buyer, videoId), true)
    let data = await sales.get(buyer, videoId)
    assert.equal(data[0], price)
    assert.equal(data[1], ipfsData)

    tx = await sales.remove(buyer, videoId)
    assert.equal(getInfoFromLogs(tx, '_videoId', 'LogRemoveSale'), videoId)
    assert.equal(getInfoFromLogs(tx, '_buyer', 'LogRemoveSale'), accounts[1])

    assert.equal(await sales.userBoughtVideo(buyer, videoId), false)
  })

  it('should be possible to "buy" a video with a price of 0', async function () {
    tx = await sales.create(accounts[1], videoId, 0, ipfsData)
    assert.equal(getInfoFromLogs(tx, '_videoId', 'LogCreateSale'), videoId)
  })

  it('only the Store contract or the owner can register a sale', async function () {
    let storeAddress = accounts[3]
    await paratiiRegistry.registerAddress('Store', storeAddress)
    tx = await sales.create(accounts[1], videoId, 0, ipfsData, {from: storeAddress})
    assert.equal(getInfoFromLogs(tx, '_videoId', 'LogCreateSale'), videoId)

    expectError(function () { return sales.create(accounts[1], videoId, 0, ipfsData, {from: accounts[4]}) })
  })
})

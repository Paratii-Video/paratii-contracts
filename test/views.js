import {
  getInfoFromLogs,
  views,
  setupParatiiContracts
} from './utils.js'

contract('Views: ', function (accounts) {
  let tx
  let videoId = '1234'
  let ipfsData = 'xdfsasfdsa'
  let buyer = accounts[1]

  it(' registering a view should work as expected', async function () {
    await setupParatiiContracts()

    assert.equal(await views.userViewedVideo(buyer, videoId), false)
    tx = await views.create(accounts[1], videoId, ipfsData)

    assert.equal(getInfoFromLogs(tx, '_address', 'LogCreateView'), accounts[1])
    assert.equal(getInfoFromLogs(tx, '_videoId', 'LogCreateView'), videoId)
    assert.equal(getInfoFromLogs(tx, '_ipfsData', 'LogCreateView'), ipfsData)

    assert.equal(await views.userViewedVideo(buyer, videoId), true)

    // TODO: why does this not work?
    // assert.equal(await views.get(buyer, videoId), 'something or other')
    tx = await views.delete(accounts[1], videoId)
    assert.equal(getInfoFromLogs(tx, '_address', 'LogDeleteView'), accounts[1])
    assert.equal(getInfoFromLogs(tx, '_videoId', 'LogDeleteView'), videoId)

    assert.equal(await views.userViewedVideo(buyer, videoId), false)
  })

  it.skip(' permissions should be working', async function () {

  })
})

import { getAddressFromLogs } from './utils.js'
var VideoRegistry = artifacts.require('./VideoRegistry.sol')

contract('VideoRegistry', function (accounts) {
  let videoOwner = accounts[2]
  let hash = '0x1234'
  let price = 31415
  let videoInfo

  it('should register a video', async function () {
    let ctt = await VideoRegistry.new()
    let paddedHash = '0x1234000000000000000000000000000000000000000000000000000000000000'
    let tx = await ctt.registerVideo(hash, videoOwner, price, {from: accounts[1]})
    assert.equal(getAddressFromLogs(tx, 'hash'), paddedHash)
    assert.equal(getAddressFromLogs(tx, 'owner'), videoOwner)

    videoInfo = await ctt.videos(hash)
    assert.equal(videoInfo[0], videoOwner)
    assert.equal(videoInfo[1], price)
  })

  it('only owner can unregister a video', async function () {
    let ctt = await VideoRegistry.new()
    await ctt.registerVideo(hash, videoOwner, price, {from: accounts[1]})

    videoInfo = await ctt.videos(hash)
    assert.equal(videoInfo[0], videoOwner)

    await ctt.unregisterVideo(hash)
    videoInfo = await ctt.videos(hash)
    assert.equal(videoInfo[0], '0x0000000000000000000000000000000000000000')
  })
})

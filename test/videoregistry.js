import { getAddressFromLogs } from './utils.js'
var VideoRegistry = artifacts.require('./VideoRegistry.sol')

contract('VideoRegistry', function (accounts) {
  let videoOwner = accounts[2]
  let videoId = '1234'
  let price = 31415
  let videoInfo

  it('should register a video', async function () {
    let videoRegistry = await VideoRegistry.new()
    // let paddedHash = '0x1234000000000000000000000000000000000000000000000000000000000000'
    let tx = await videoRegistry.registerVideo(videoId, videoOwner, price, {from: accounts[1]})
    assert.equal(getAddressFromLogs(tx, 'videoId'), videoId)
    assert.equal(getAddressFromLogs(tx, 'owner'), videoOwner)

    videoInfo = await videoRegistry.getVideoInfo(videoId)
    assert.equal(videoInfo[0], videoOwner)
    assert.equal(videoInfo[1], price)


  })

  it('only owner can unregister a video', async function () {
    let videoRegistry = await VideoRegistry.new()
    await videoRegistry.registerVideo(videoId, videoOwner, price, {from: accounts[1]})

    videoInfo = await videoRegistry.getVideoInfo(videoId)
    assert.equal(videoInfo[0], videoOwner)

    await videoRegistry.unregisterVideo(videoId)
    videoInfo = await videoRegistry.getVideoInfo(videoId)
    assert.equal(videoInfo[0], '0x0000000000000000000000000000000000000000')
  })
})

import { getValueFromLogs } from './utils.js'
var VideoRegistry = artifacts.require('./VideoRegistry.sol')

contract('VideoRegistry', function (accounts) {
  it('should register a video', async function () {
    let ctt = await VideoRegistry.new()
    let videoOwner = accounts[2]
    let hash = '0x1234'
    let paddedHash = '0x1234000000000000000000000000000000000000000000000000000000000000'
    let tx = await ctt.registerVideo(hash, videoOwner, {from: accounts[1]})
    assert.equal(getValueFromLogs(tx, 'hash'), paddedHash)
    assert.equal(getValueFromLogs(tx, 'owner'), videoOwner)

    let videoInfo = await ctt.videos(hash)
    assert.equal(videoInfo, videoOwner)
  })

  it('only ownwer can unregister a video', async function () {
    let ctt = await VideoRegistry.new()
    let videoOwner = accounts[2]
    let hash = '0x1234'
    await ctt.registerVideo(hash, videoOwner, {from: accounts[1]})

    await ctt.unregisterVideo(hash)
    let videoInfo = await ctt.videos(hash)
    assert.equal(videoInfo, '0x0000000000000000000000000000000000000000')
  })
})

import { getInfoFromLogs, expectError, setupParatiiContracts, videoRegistry} from './utils.js'
var VideoRegistry = artifacts.require('./VideoRegistry.sol')

contract('VideoRegistry', function (accounts) {
  let videoOwner = accounts[2]
  let videoId = '1234'
  let price = 31415
  let videoInfo

  it('should register a video', async function () {
    await setupParatiiContracts()
    let tx = await videoRegistry.registerVideo(videoId, videoOwner, price)
    assert.equal(getInfoFromLogs(tx, 'videoId'), videoId)
    assert.equal(getInfoFromLogs(tx, 'owner'), videoOwner)

    videoInfo = await videoRegistry.getVideoInfo(videoId)
    assert.equal(videoInfo[0], videoOwner)
    assert.equal(videoInfo[1], price)
  })

  it('a non-owner cannot register a video', async function () {
    let videoRegistry = await VideoRegistry.new()
    expectError(async function() {
      await videoRegistry.registerVideo(videoId, videoOwner, price, {from: web3.eth.accounts[1]})
    })
  })

  it('a non-owner cannot register a video', async function () {
    let videoRegistry = await VideoRegistry.new()
    await expectError(async function() {
      await videoRegistry.registerVideo(videoId, videoOwner, price, {from: web3.eth.accounts[1]})
    })
  })
})

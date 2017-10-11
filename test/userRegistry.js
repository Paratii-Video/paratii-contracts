import { getInfoFromLogs } from './utils.js'
var UserRegistry = artifacts.require('./UserRegistry.sol')

contract('UserRegistry', function (accounts) {
  let videoId = '1234'
  let price = 31415
  let userInfo
  let userAddress = web3.eth.accounts[3]
  let name = 'Flash Gordon'
  let email = 'flash@theuniver.se'
  let tx

  it('should register a user', async function () {
    let userRegistry = await UserRegistry.new()
    tx = await userRegistry.registerUser(userAddress, name, email)
    assert.equal(getInfoFromLogs(tx, '_address'), userAddress)
    assert.equal(getInfoFromLogs(tx, '_name'), name)
    assert.equal(getInfoFromLogs(tx, '_email'), email)

    userInfo = await userRegistry.getUserInfo(userAddress)
    assert.equal(userInfo[0], name, userInfo)
    assert.equal(userInfo[1], email)
  })

  it('only owner can or the user itself can register or unregister [TODO]', async function () {
    let userRegistry = await UserRegistry.new()
    await userRegistry.registerUser(userAddress, name, email)

    // unregister as woner

  })

  it('like a video should work as expected', async function () {
    let userRegistry = await UserRegistry.new()
    await userRegistry.registerUser(userAddress, name, email)

    tx = await userRegistry.likeVideo(videoId, true, {from: userAddress})
    assert.equal(getInfoFromLogs(tx, '_address'), userAddress)
    assert.equal(getInfoFromLogs(tx, '_videoId'), videoId)
    assert.equal(getInfoFromLogs(tx, '_liked'), true)

    tx = await userRegistry.userLikesVideo(userAddress, videoId)
    assert.equal(tx, true)
    tx = await userRegistry.userDislikesVideo(userAddress, videoId)
    assert.equal(tx, false)

    tx = await userRegistry.likeVideo(videoId, false, {from: userAddress})
    assert.equal(getInfoFromLogs(tx, '_address'), userAddress)
    assert.equal(getInfoFromLogs(tx, '_videoId'), videoId)
    assert.equal(getInfoFromLogs(tx, '_liked'), false)

    tx = await userRegistry.userLikesVideo(userAddress, videoId)
    assert.equal(tx, false)
    tx = await userRegistry.userDislikesVideo(userAddress, videoId)
    assert.equal(tx, true)
  })
})

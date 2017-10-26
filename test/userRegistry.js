import { getInfoFromLogs, expectError, setupParatiiContracts, userRegistry } from './utils.js'
var UserRegistry = artifacts.require('./UserRegistry.sol')

contract('UserRegistry', function (accounts) {
  let videoId = '1234'
  let price = 31415
  let userInfo
  let userAddress = web3.eth.accounts[3]
  let name = 'Flash Gordon'
  let email = 'flash@theuniver.se'
  let avatar = '/avatar'
  let tx

  it('should register a user', async function () {
    await setupParatiiContracts()
    tx = await userRegistry.registerUser(userAddress, name, email, avatar)
    assert.equal(getInfoFromLogs(tx, '_address'), userAddress)
    assert.equal(getInfoFromLogs(tx, '_name'), name)
    assert.equal(getInfoFromLogs(tx, '_email'), email)
    assert.equal(getInfoFromLogs(tx, '_avatar'), avatar)

    userInfo = await userRegistry.getUserInfo(userAddress)
    assert.equal(userInfo[0], name)
    assert.equal(userInfo[1], email)
  })

  it('the owner can register and unregister', async function () {
    await setupParatiiContracts()
    await userRegistry.registerUser(userAddress, name, email, avatar, {from: web3.eth.accounts[0]})
    await userRegistry.unregisterUser(userAddress, {from: web3.eth.accounts[0]})
  })

  it('the user itself can register or unregister', async function () {
    await setupParatiiContracts()
    await userRegistry.registerUser(userAddress, name, email, avatar, {from: userAddress})
    await userRegistry.unregisterUser(userAddress, {from: userAddress})
  })

  it('an non-owner cannot register or unregister a user (other than itself)', async function() {
    await setupParatiiContracts()
    await expectError(async function() {
      await userRegistry.registerUser(web3.eth.accounts[1], name, email, avatar, {from: web3.eth.accounts[2]})
    })

    return
    // now register a user and try to unregister it from another account
    await userRegistry.registerUser(web3.eth.accounts[1], name, email, avatar)

    await expectError(async function() {
      await userRegistry.unregisterUser(web3.eth.accounts[1], {from: web3.eth.accounts[2]})
    })
  })

  it('like and dislike a video should work as expected', async function () {
    await setupParatiiContracts()
    await userRegistry.registerUser(userAddress, name, email, avatar)

    assert.equal(await userRegistry.userLikesVideo(userAddress, videoId).valueOf(), false)
    assert.equal(await userRegistry.userDislikesVideo(userAddress, videoId).valueOf(), false)
    assert.equal(await userRegistry.userAcquiredVideo(userAddress, videoId).valueOf(), false)

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

import { expectError, getInfoFromLogs, avatar, paratiiToken, setupParatiiContracts, userRegistry, videoRegistry, videoStore } from './utils.js'

contract('Users', function (accounts) {
  let videoId = '1234'
  let price = 31415
  let userInfo
  let names = ['Flash Gordon', 'Buyer One', 'Buyer Two']
  let emails = ['flash@theuniver.se', 'accounts[1]@gmail.com', 'buyer2@gmail.com']
  let ipfsHash = 'QmZW1CRFwc1RR7ceUtsaHjjb4zAjmXmkg29pQy7U1xxhMt'
  let tx

  /**
   * Three users are registered
   * A video is registered
   * accounts[0] owns the video
   * accounts[1:2] buy the video
   */
  async function setStage () {
    await setupParatiiContracts()
    for (var i = 0; i < names.length; i++) {
      await userRegistry.registerUser(accounts[i], names[i], emails[i])
      if (i !== 0) {
        await paratiiToken.transfer(accounts[i], Number(price) + (1 * 10 ** 18))
        await paratiiToken.approve(avatar.address, Number(price), {from: accounts[i]})
        videoStore.buyVideo(videoId, {from: accounts[i]})
      } else {
        await videoRegistry.registerVideo(videoId, accounts[0], price, ipfsHash)
      }
    }
  }

  it('should register a user', async function () {
    await setupParatiiContracts()
    tx = await userRegistry.registerUser(accounts[0], names[0], emails[0])
    assert.equal(getInfoFromLogs(tx, '_address'), accounts[0])
    assert.equal(getInfoFromLogs(tx, '_name'), names[0])
    assert.equal(getInfoFromLogs(tx, '_email'), emails[0])

    userInfo = await userRegistry.getUserInfo(accounts[0])
    assert.equal(userInfo[0], names[0])
    assert.equal(userInfo[1], emails[0])
  })

  it('the owner can register and unregister', async function () {
    await setupParatiiContracts()
    await userRegistry.registerUser(accounts[0], names[0], emails[0], {from: accounts[0]})
    await userRegistry.unregisterUser(accounts[0], {from: accounts[0]})
  })

  it('the user itself can register or unregister', async function () {
    await setupParatiiContracts()
    await userRegistry.registerUser(accounts[0], names[0], emails[0], {from: accounts[0]})
    await userRegistry.unregisterUser(accounts[0], {from: accounts[0]})
  })

  it('an non-owner cannot register or unregister a user (other than itself)', async function () {
    await setupParatiiContracts()
    await expectError(async function () {
      await userRegistry.registerUser(accounts[1], names[0], emails[0], {from: accounts[2]})
    })

    // now register a user and try to unregister it from another account
    await userRegistry.registerUser(accounts[1], names[0], emails[0])

    await expectError(async function () {
      await userRegistry.unregisterUser(accounts[1], {from: accounts[2]})
    })
  })

  it('like video should work as expected', async function () {
    await setupParatiiContracts()
    await userRegistry.registerUser(accounts[0], names[0], emails[0])
    await videoRegistry.registerVideo(videoId, accounts[0], price, ipfsHash)

    await paratiiToken.transfer(accounts[1], Number(price) + (1 * 10 ** 18))
    await paratiiToken.approve(avatar.address, Number(price), {from: accounts[1]})

    assert.equal(await userRegistry.userAcquiredVideo(accounts[1], videoId).valueOf(), false)

    // can't like or dislike unaqcuired videos
    await expectError(async function () {
      await userRegistry.likeVideo(videoId, true, {from: accounts[1]})
    })

    await expectError(async function () {
      await userRegistry.likeVideo(videoId, false, {from: accounts[1]})
    })

    await videoStore.buyVideo(videoId, {from: accounts[1]})

    assert.equal(await userRegistry.userLikesVideo(accounts[1], videoId).valueOf(), false)
    assert.equal(await userRegistry.userDislikesVideo(accounts[1], videoId).valueOf(), false)
    assert.equal(await userRegistry.userAcquiredVideo(accounts[1], videoId).valueOf(), true)

    tx = await userRegistry.likeVideo(videoId, true, {from: accounts[1]})
    assert.equal(getInfoFromLogs(tx, '_address'), accounts[1])
    assert.equal(getInfoFromLogs(tx, '_videoId'), videoId)
    assert.equal(getInfoFromLogs(tx, '_liked'), true)

    tx = await userRegistry.userLikesVideo(accounts[1], videoId)
    assert.equal(tx, true)
    tx = await userRegistry.userDislikesVideo(accounts[1], videoId)
    assert.equal(tx, false)

    var stats = await videoRegistry.getStats(videoId)
    assert.equal(stats[0], 0)
    assert.equal(stats[1], 1)
    assert.equal(stats[2], 0)
  })

  it('dislike video should work as expected', async function () {
    await setupParatiiContracts()
    await userRegistry.registerUser(accounts[0], names[0], emails[0])
    await videoRegistry.registerVideo(videoId, accounts[0], price, ipfsHash)

    await paratiiToken.transfer(accounts[1], Number(price) + (1 * 10 ** 18))
    await paratiiToken.approve(avatar.address, Number(price), {from: accounts[1]})
    await videoStore.buyVideo(videoId, {from: accounts[1]})

    tx = await userRegistry.likeVideo(videoId, false, {from: accounts[1]})
    assert.equal(getInfoFromLogs(tx, '_address'), accounts[1])
    assert.equal(getInfoFromLogs(tx, '_videoId'), videoId)
    assert.equal(getInfoFromLogs(tx, '_liked'), false)

    tx = await userRegistry.userLikesVideo(accounts[1], videoId)
    assert.equal(tx, false)
    tx = await userRegistry.userDislikesVideo(accounts[1], videoId)
    assert.equal(tx, true)

    var stats = await videoRegistry.getStats(videoId)
    assert.equal(stats[0], 0)
    assert.equal(stats[1], 0)
    assert.equal(stats[2], 1)
  })

  it('dislike video should override like', async function () {
    await setStage()

    await userRegistry.likeVideo(videoId, true, {from: accounts[1]})
    await userRegistry.likeVideo(videoId, false, {from: accounts[1]})

    tx = await userRegistry.userLikesVideo(accounts[1], videoId)
    assert.equal(tx, false)
    tx = await userRegistry.userDislikesVideo(accounts[1], videoId)
    assert.equal(tx, true)

    var stats = await videoRegistry.getStats(videoId)
    assert.equal(stats[0], 0)
    assert.equal(stats[1], 0)
    assert.equal(stats[2], 1)
  })

  it('like video should override dislike', async function () {
    await setStage()

    await userRegistry.likeVideo(videoId, false, {from: accounts[1]})
    await userRegistry.likeVideo(videoId, true, {from: accounts[1]})

    tx = await userRegistry.userLikesVideo(accounts[1], videoId)
    assert.equal(tx, true)
    tx = await userRegistry.userDislikesVideo(accounts[1], videoId)
    assert.equal(tx, false)

    var stats = await videoRegistry.getStats(videoId)
    assert.equal(stats[0], 0)
    assert.equal(stats[1], 1)
    assert.equal(stats[2], 0)
  })

  it('like video should be cumulative', async function () {
    await setStage()

    await userRegistry.likeVideo(videoId, true, {from: accounts[1]})
    await userRegistry.likeVideo(videoId, true, {from: accounts[2]})

    tx = await userRegistry.userLikesVideo(accounts[1], videoId)
    assert.equal(tx, true)
    tx = await userRegistry.userDislikesVideo(accounts[1], videoId)
    assert.equal(tx, false)

    tx = await userRegistry.userLikesVideo(accounts[2], videoId)
    assert.equal(tx, true)
    tx = await userRegistry.userDislikesVideo(accounts[2], videoId)
    assert.equal(tx, false)

    var stats = await videoRegistry.getStats(videoId)
    assert.equal(stats[0], 0)
    assert.equal(stats[1], 2)
    assert.equal(stats[2], 0)
  })

  it('dislike video should be cumulative', async function () {
    await setStage()

    await userRegistry.likeVideo(videoId, false, {from: accounts[1]})
    await userRegistry.likeVideo(videoId, false, {from: accounts[2]})

    tx = await userRegistry.userLikesVideo(accounts[1], videoId)
    assert.equal(tx, false)
    tx = await userRegistry.userDislikesVideo(accounts[1], videoId)
    assert.equal(tx, true)

    tx = await userRegistry.userLikesVideo(accounts[2], videoId)
    assert.equal(tx, false)
    tx = await userRegistry.userDislikesVideo(accounts[2], videoId)
    assert.equal(tx, true)

    var stats = await videoRegistry.getStats(videoId)
    assert.equal(stats[0], 0)
    assert.equal(stats[1], 0)
    assert.equal(stats[2], 2)
  })

  it('dislikes and likes can coexist', async function () {
    await setStage()

    await userRegistry.likeVideo(videoId, false, {from: accounts[1]})
    await userRegistry.likeVideo(videoId, true, {from: accounts[2]})

    var stats = await videoRegistry.getStats(videoId)
    assert.equal(stats[0], 0)
    assert.equal(stats[1], 1)
    assert.equal(stats[2], 1)
  })
})

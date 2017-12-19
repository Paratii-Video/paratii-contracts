import {
  getInfoFromLogs,
  likes,
  avatar,
  paratiiToken,
  setupParatiiContracts,
  userRegistry,
  videoRegistry,
  videoStore
} from './utils.js'

contract('Likes', function (accounts) {
  let videoId = '1234'
  let price = 31415
  let names = ['Flash Gordon', 'Buyer One', 'Buyer Two']
  let emails = ['flash@theuniver.se', 'accounts[1]@gmail.com', 'buyer2@gmail.com']
  let avatars = ['/avatar', '/avatar1', '/avatar2']
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
      await userRegistry.registerUser(accounts[i], names[i], emails[i], avatars[i])
      if (i !== 0) {
        await paratiiToken.transfer(accounts[i], Number(price) + (1 * 10 ** 18))
        await paratiiToken.approve(avatar.address, Number(price), {from: accounts[i]})
        videoStore.buyVideo(videoId, {from: accounts[i]})
      } else {
        await videoRegistry.registerVideo(videoId, accounts[0], price, ipfsHash)
      }
    }
  }

  it('like video should work as expected', async function () {
    await setupParatiiContracts()

    assert.equal(await likes.userLikesVideo(accounts[1], videoId).valueOf(), false)
    assert.equal(await likes.userDislikesVideo(accounts[1], videoId).valueOf(), false)

    assert.equal(Number(await likes.vidLikes(videoId)), 0)

    // assert.equal(Number(await likes.userLikes(accounts[1])), 0)
    //
    // tx = await likes.likeVideo(videoId, true, {from: accounts[1]})
    // assert.equal(getInfoFromLogs(tx, '_address', 'UserLikedVideo'), accounts[1])
    // assert.equal(getInfoFromLogs(tx, '_videoId'), videoId)
    // assert.equal(getInfoFromLogs(tx, '_liked'), true)
    //
    // assert.equal(await likes.userLikesVideo(accounts[1], videoId), true)
    // assert.equal(await likes.userDislikesVideo(accounts[1], videoId), false)
    // assert.equal(await likes.userLikes(accounts[1]), 1)
    // assert.equal(Number(await likes.vidLikes(videoId)), 1)
  })

  it.skip('dislike video should work as expected', async function () {
    await setupParatiiContracts()
    await userRegistry.registerUser(accounts[0], names[0], emails[0], avatars[0])
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

  it.skip('dislike video should override like', async function () {
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

  it.skip('like video should override dislike', async function () {
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

  it.skip('like video should be cumulative', async function () {
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

  it.skip('dislike video should be cumulative', async function () {
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

  it.skip('dislikes and likes can coexist', async function () {
    await setStage()

    await userRegistry.likeVideo(videoId, false, {from: accounts[1]})
    await userRegistry.likeVideo(videoId, true, {from: accounts[2]})

    var stats = await videoRegistry.getStats(videoId)
    assert.equal(stats[0], 0)
    assert.equal(stats[1], 1)
    assert.equal(stats[2], 1)
  })
})
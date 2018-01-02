import {
  getInfoFromLogs,
  likes,
  setupParatiiContracts
} from './utils.js'

contract('Likes', function (accounts) {
  let videoId = '1234'
  let tx

  it('like video should work as expected', async function () {
    await setupParatiiContracts()

    assert.equal(await likes.userLikesVideo(accounts[1], videoId).valueOf(), false)
    assert.equal(await likes.userDislikesVideo(accounts[1], videoId).valueOf(), false)

    assert.equal(Number(await likes.vidLikes(videoId)), 0)
    assert.equal(Number(await likes.userLikes(accounts[1])), 0)

    tx = await likes.likeVideo(videoId, true, {from: accounts[1]})
    assert.equal(getInfoFromLogs(tx, '_address', 'LogLikeVideo'), accounts[1])
    assert.equal(getInfoFromLogs(tx, '_videoId'), videoId)
    assert.equal(getInfoFromLogs(tx, '_liked'), true)

    assert.equal(await likes.userLikesVideo(accounts[1], videoId), true)
    assert.equal(await likes.userDislikesVideo(accounts[1], videoId), false)
    assert.equal(await likes.userLikes(accounts[1]), 1)
    assert.equal(Number(await likes.vidLikes(videoId)), 1)
    assert.equal(Number(await likes.vidDislikes(videoId)), 0)
    assert.equal(Number(await likes.userDislikes(videoId)), 0)
  })

  it('dislike video should work as expected', async function () {
    await setupParatiiContracts()

    tx = await likes.likeVideo(videoId, false, {from: accounts[1]})
    assert.equal(getInfoFromLogs(tx, '_address'), accounts[1])
    assert.equal(getInfoFromLogs(tx, '_videoId'), videoId)
    assert.equal(getInfoFromLogs(tx, '_liked'), false)

    assert.equal(await likes.userLikesVideo(accounts[1], videoId), false)
    assert.equal(await likes.userDislikesVideo(accounts[1], videoId), true)
    assert.equal(await likes.userLikes(accounts[1]), 0)
    assert.equal(Number(await likes.userDislikes(accounts[1])), 1)
    assert.equal(Number(await likes.vidLikes(videoId)), 0)
    assert.equal(Number(await likes.vidDislikes(videoId)), 1)
  })

  it('dislike video should override like', async function () {
    await setupParatiiContracts()

    await likes.likeVideo(videoId, true, {from: accounts[1]})
    await likes.likeVideo(videoId, false, {from: accounts[1]})

    assert.equal(await likes.userLikesVideo(accounts[1], videoId), false)
    assert.equal(await likes.userDislikesVideo(accounts[1], videoId), true)

    assert.equal(Number(await likes.userLikes(accounts[1])), 0)
    assert.equal(Number(await likes.userDislikes(accounts[1])), 1)
    assert.equal(Number(await likes.vidLikes(videoId)), 0)
    assert.equal(Number(await likes.vidDislikes(videoId)), 1)
  })

  it('like video should override dislike', async function () {
    await setupParatiiContracts()

    await likes.likeVideo(videoId, false, {from: accounts[1]})
    await likes.likeVideo(videoId, true, {from: accounts[1]})

    assert.equal(await likes.userLikesVideo(accounts[1], videoId), true)
    assert.equal(await likes.userDislikesVideo(accounts[1], videoId), false)

    assert.equal(Number(await likes.userLikes(accounts[1])), 1)
    assert.equal(Number(await likes.userDislikes(accounts[1])), 0)
    assert.equal(Number(await likes.vidLikes(videoId)), 1)
    assert.equal(Number(await likes.vidDislikes(videoId)), 0)
  })

  it('like video should be cumulative', async function () {
    await setupParatiiContracts()

    await likes.likeVideo(videoId, true, {from: accounts[1]})
    await likes.likeVideo(videoId, true, {from: accounts[2]})

    assert.equal(await likes.userLikesVideo(accounts[1], videoId), true)
    assert.equal(await likes.userDislikesVideo(accounts[1], videoId), false)

    assert.equal(await likes.userLikesVideo(accounts[2], videoId), true)
    assert.equal(await likes.userDislikesVideo(accounts[2], videoId), false)

    assert.equal(Number(await likes.userLikes(accounts[2])), 1)
    assert.equal(Number(await likes.userDislikes(accounts[2])), 0)
    assert.equal(Number(await likes.vidLikes(videoId)), 2)
    assert.equal(Number(await likes.vidDislikes(videoId)), 0)
  })

  it('dislike video should be cumulative', async function () {
    await setupParatiiContracts()

    await likes.likeVideo(videoId, false, {from: accounts[1]})
    await likes.likeVideo(videoId, false, {from: accounts[2]})

    assert.equal(await likes.userLikesVideo(accounts[1], videoId), false)
    assert.equal(await likes.userDislikesVideo(accounts[1], videoId), true)

    assert.equal(await likes.userLikesVideo(accounts[2], videoId), false)
    assert.equal(await likes.userDislikesVideo(accounts[2], videoId), true)

    assert.equal(Number(await likes.userLikes(accounts[2])), 0)
    assert.equal(Number(await likes.userDislikes(accounts[2])), 1)
    assert.equal(Number(await likes.vidLikes(videoId)), 0)
    assert.equal(Number(await likes.vidDislikes(videoId)), 2)
  })

  it('dislikes and likes can coexist', async function () {
    await setupParatiiContracts()

    await likes.likeVideo(videoId, false, {from: accounts[1]})
    await likes.likeVideo(videoId, true, {from: accounts[2]})

    assert.equal(Number(await likes.vidLikes(videoId)), 1)
    assert.equal(Number(await likes.vidDislikes(videoId)), 1)
  })
})

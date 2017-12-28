import { getInfoFromLogs, setupParatiiContracts, userRegistry, videoRegistry, avatar, paratiiToken, videoStore } from './utils.js'

contract('Store', function (accounts) {
  it.skip('should be able to buy a registered video', async function () {
    await setupParatiiContracts()
    let buyer = accounts[1]
    let owner = accounts[2]
    let videoId = '0x1234'
    let price = 14 * 10 ** 18
    let ipfsHash = 'QmZW1CRFwc1RR7ceUtsaHjjb4zAjmXmkg29pQy7U1xxhMt'

    assert.equal(price, web3.toWei(14))
    assert.isOk(price === Number(web3.toWei(14)))
    price = web3.toWei(14)

    await videoRegistry.registerVideo(videoId, owner, Number(price), ipfsHash)
    // get the buyer some PTI
    await paratiiToken.transfer(buyer, Number(price) + (1 * 10 ** 18))

    // PTI balance of owner before the transaction
    let ownerBalance = await paratiiToken.balanceOf(owner)
    let avatarBalance = await paratiiToken.balanceOf(avatar.address)

    assert.equal(await userRegistry.userLikesVideo(buyer, videoId).valueOf(), false)
    assert.equal(await userRegistry.userDislikesVideo(buyer, videoId).valueOf(), false)
    assert.equal(await userRegistry.userAcquiredVideo(buyer, videoId).valueOf(), false)

    // the actualtransaction takes two steps:
    //  (1) give the avatar an allowance to spend the price fo the video
    await paratiiToken.approve(avatar.address, Number(price), {from: buyer})
    assert.equal(Number(await paratiiToken.allowance(buyer, avatar.address)), price)

    //  (2) instruct the avatar to actually buy the video (calling videoStore.buyVideo())
    let tx = await videoStore.buyVideo(videoId, {from: buyer})
    assert.equal(getInfoFromLogs(tx, 'videoId', 'LogBuyVideo'), videoId)
    assert.equal(getInfoFromLogs(tx, 'buyer', 'LogBuyVideo'), buyer)
    assert.equal(Number(getInfoFromLogs(tx, 'price', 'LogBuyVideo')), price)

    // 30% of the price should have gone to the redistribution pool (i.e. the avatar)
    assert.equal(Number(await paratiiToken.balanceOf(avatar.address)) - avatarBalance, 0.3 * price)

    // and 70% to the owner
    assert.equal(Number(await paratiiToken.balanceOf(owner)) - ownerBalance, 0.7 * price)

   // video purchase was properly recorded
    assert.equal(Boolean(userRegistry.userAcquiredVideo(buyer, videoId)), true)
  })
})

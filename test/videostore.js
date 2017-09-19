import { getAddressFromLogs, setupParatiiContracts, ParatiiRegistry, videoRegistry, paratiiAvatar, paratiiToken, videoStore } from './utils.js'

contract('VideoStore', function (accounts) {
  it('should be able to buy a registered video', async function () {
    await setupParatiiContracts()
    let buyer = accounts[0]
    let owner = accounts[2]
    let hash = '0x1234'
    let hashPadded = '0x1234000000000000000000000000000000000000000000000000000000000000'
    let price = 7 * 10 ** 18

    await videoRegistry.registerVideo(hash, owner, price, {from: accounts[1]})
    // get the buyer some PTI
    await paratiiToken.transfer(buyer, price + (1 * 10 ** 18))

    // PTI balance of owner before the transaction
    let ownerBalance = await paratiiToken.balanceOf(owner)
    let avatarBalance = await paratiiToken.balanceOf(paratiiAvatar.address)

    // the actualtransaction takes two steps:
    //  (1) give the paratiiAvatar an allowance to spend the price fo the video
    await paratiiToken.approve(paratiiAvatar.address, price, {from: buyer})
    assert.equal(Number(await paratiiToken.allowance(buyer, paratiiAvatar.address)), price)

    //  (2) instruct the paratiiAvatar to actually buy the video (calling videoStore.buyVideo())
    let tx = await videoStore.buyVideo(hash)
    assert.equal(getAddressFromLogs(tx, 'videoId', 'LogBuyVideo'), hashPadded)
    assert.equal(getAddressFromLogs(tx, 'buyer', 'LogBuyVideo'), buyer)
    assert.equal(Number(getAddressFromLogs(tx, 'price', 'LogBuyVideo')), price)

    // 30% of the price should have gone to the redistribution pool (i.e. the avatar)
    assert.equal(Number(await paratiiToken.balanceOf(paratiiAvatar.address)) - avatarBalance, 0.3 * price)

    // and 70% to the owner
    assert.equal(Number(await paratiiToken.balanceOf(owner)) - ownerBalance, 0.7 * price)
  })
})

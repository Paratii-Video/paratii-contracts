import { getValueFromLogs, setupParatiiContracts, videoRegistry, paratiiAvatar, paratiiToken, videoStore, videoContract } from './utils.js'

contract('VideoStore', function (accounts) {
  it('should be able to buy a registered video', async function () {
    await setupParatiiContracts()
    let buyer = accounts[0]
    let owner = accounts[2]
    let hash = '0x1234'
    let hashPadded = '0x1234000000000000000000000000000000000000000000000000000000000000'
    let price = 7 * 10 ** 18

    await videoRegistry.registerVideo(hash, videoContract, {from: accounts[1]})
    // get the buyer some PTI
    await paratiiToken.transfer(buyer, price + 1 * 10 ** 18)

    // the actualtransaction takes two steps:
    //  (1) give the paratiiAvatar an allowance to spend the price fo the video
    await paratiiToken.approve(paratiiAvatar.address, price, {from: buyer})
    assert.equal(Number(await paratiiToken.allowance(buyer, paratiiAvatar.address)), price)
    //  (2) instruct the paratiiAvatar to actually buy the video (calling videoStore.buyVideo())
    let tx = await videoStore.buyVideo(hash)
    assert.equal(getValueFromLogs(tx, 'videoId'), hashPadded)
    assert.equal(getValueFromLogs(tx, 'buyer'), buyer)
    assert.equal(Number(getValueFromLogs(tx, 'price')), price)
  })
})

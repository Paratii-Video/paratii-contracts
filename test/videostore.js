import { getValueFromLogs, setupParatiiContracts, videoRegistry, paratiiToken, videoStore } from './utils.js'

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
    // TODO: we really want to give an allowance to the paratiiAvatar
    // let spenderAddress = paratiiAvatar.address
    let spenderAddress = videoStore.address

    await paratiiToken.approve(spenderAddress, price)
    assert.equal(Number(await paratiiToken.allowance(buyer, spenderAddress)), price)
    assert.equal(paratiiToken.address, await videoStore.paratiiToken())
    assert.equal((await videoStore.videoRegistry()), videoRegistry.address)
    let tx = await videoStore.buyVideo(hash)
    assert.equal(getValueFromLogs(tx, 'videoId'), hashPadded)
    assert.equal(getValueFromLogs(tx, 'buyer'), buyer)
    assert.equal(Number(getValueFromLogs(tx, 'price')), price)
  })
})

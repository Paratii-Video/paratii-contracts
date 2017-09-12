import { getValueFromLogs } from './utils.js'
let VideoRegistry = artifacts.require('./VideoRegistry.sol')
let VideoStore = artifacts.require('./VideoStore')
let ParatiiToken = artifacts.require('./ParatiiToken')

contract('VideoStore', function (accounts) {
  it('should be able to buy a registered video', async function () {
    let buyer = accounts[1]
    let owner = accounts[2]
    let hash = '0x1234'
    let videoRegistry = await VideoRegistry.new()
    let paratiiToken = await ParatiiToken.new()
    let videoStore = await VideoStore.new(paratiiToken.address, videoRegistry.address)
    let price = 7 * 10 ** 18
    await videoRegistry.registerVideo(hash, owner, price, {from: accounts[1]})
    // get the buyer some PTI
    await paratiiToken.approve(owner, price)

    //
    await videoStore.buyVideo(hash)

  })
})

import { getValueFromLogs } from './utils.js'
let VideoRegistry = artifacts.require('./VideoRegistry.sol')
let BuyVideo = artifacts.require('./BuyVideo')
let ParatiiToken = artifacts.require('./ParatiiToken')

contract('BuyVideo', function (accounts) {
  it('should be able to buy a registered video', async function () {
    let buyer = accounts[1]
    let owner = accounts[2]
    let hash = '0x1234'
    let videoRegistry = await VideoRegistry.new()
    let paratiiToken = await ParatiiToken.new()
    let buyVideo = await BuyVideo.new()
    let paddedHash = '0x1234000000000000000000000000000000000000000000000000000000000000'
    await videoRegistry.registerVideo(hash, owner, {from: accounts[1]})

  })
})

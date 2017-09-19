import { getValueFromLogs } from './utils.js'
var VideoRegistry = artifacts.require('./VideoRegistry.sol')
var VideoContract = artifacts.require('./VideoContract.sol')

contract('VideoRegistry', function (accounts) {
  let videoOwner = accounts[2]
  let hash = '0x1234'
  let price = 31415
  let videoInfo

  it('should register a video', async function () {
    let ctt = await VideoRegistry.new()
    let videoContract = await VideoContract.new(price)
    let paddedHash = '0x1234000000000000000000000000000000000000000000000000000000000000'
    let tx = await ctt.registerVideo(hash, accounts[1], {from: videoOwner})
    assert.equal(getValueFromLogs(tx, 'hash'), paddedHash)
    assert.equal(getValueFromLogs(tx, 'owner'), videoOwner)

    let contract_address = await ctt.videos(hash)
    assert.equal(contract_address, accounts[1])
  })

  it('only ownwer can unregister a video', async function () {
    let ctt = await VideoRegistry.new()
    let videoContract = await VideoContract.new(10)
    await ctt.registerVideo(hash, videoContract, {from: accounts[1]})

    let _videoContract = await ctt.videos(hash)
    assert.equal(_videoContract.owner, videoContract.owner)
    assert.equal(_videoContract.default_price, videoContract.default_price)

    await ctt.unregisterVideo(hash)
    _videoContract = await ctt.videos(hash)
    assert.equal(_videoContract, '0x0000000000000000000000000000000000000000')
  })
})

import { expectError, getInfoFromLogs, setupParatiiContracts, userRegistry } from './utils.js'

contract('Users: ', function (accounts) {
  let userInfo
  let names = ['Flash Gordon', 'Buyer One', 'Buyer Two']
  let emails = ['flash@theuniver.se', 'accounts[1]@gmail.com', 'buyer2@gmail.com']
  let ipfsHash = 'QmZW1CRFwc1RR7ceUtsaHjjb4zAjmXmkg29pQy7U1xxhMt'
  let ipfsData = 'QmZW1CRFwc1RR7ceUtsaHjjb4zAjmXmkg29pQy7U1xxhMu'
  let tx

  /**
   * Three users are registered
   * A video is registered
   * accounts[0] owns the video
   * accounts[1:2] buy the video
   */
  // async function setStage () {
  //   await setupParatiiContracts()
  //   for (var i = 0; i < names.length; i++) {
  //     await userRegistry.registerUser(accounts[i], names[i], emails[i], ipfsHash)
  //     if (i !== 0) {
  //       await paratiiToken.transfer(accounts[i], Number(price) + (1 * 10 ** 18))
  //       await paratiiToken.approve(avatar.address, Number(price), {from: accounts[i]})
  //       videoStore.buyVideo(videoId, {from: accounts[i]})
  //     } else {
  //       await videoRegistry.registerVideo(videoId, accounts[0], price, ipfsHash)
  //     }
  //   }
  // }

  it('should register a user', async function () {
    await setupParatiiContracts()
    tx = await userRegistry.registerUser(accounts[0], names[0], emails[0], ipfsHash, ipfsData)
    assert.equal(getInfoFromLogs(tx, '_address'), accounts[0])
    assert.equal(getInfoFromLogs(tx, '_name'), names[0])
    assert.equal(getInfoFromLogs(tx, '_email'), emails[0])
    assert.equal(getInfoFromLogs(tx, '_ipfsHash'), ipfsHash)
    assert.equal(getInfoFromLogs(tx, '_ipfsData'), ipfsData)

    userInfo = await userRegistry.getUserInfo(accounts[0])
    assert.equal(userInfo[0], names[0])
    assert.equal(userInfo[1], emails[0])
  })

  it('the owner can register and unregister', async function () {
    await setupParatiiContracts()
    await userRegistry.registerUser(accounts[0], names[0], emails[0], ipfsHash, ipfsData)
    await userRegistry.unregisterUser(accounts[0], {from: accounts[0]})
  })

  it('the user itself can register or unregister', async function () {
    await setupParatiiContracts()
    await userRegistry.registerUser(accounts[1], names[0], emails[0], ipfsHash, ipfsData)
    await userRegistry.unregisterUser(accounts[1], {from: accounts[1]})
  })

  it('an non-owner cannot register or unregister a user (other than itself)', async function () {
    await setupParatiiContracts()
    await expectError(async function () {
      await userRegistry.registerUser(accounts[1], names[0], emails[0], ipfsHash, ipfsData, {from: accounts[2]})
    })

    // now register a user and try to unregister it from another account
    await userRegistry.registerUser(accounts[1], names[0], emails[0], ipfsHash, ipfsData)

    await expectError(async function () {
      await userRegistry.unregisterUser(accounts[1], {from: accounts[2]})
    })
  })
})

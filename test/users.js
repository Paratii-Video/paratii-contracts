import {
  expectError,
  getInfoFromLogs,
  setupParatiiContracts,
  userRegistry
} from './utils.js'

contract('Users: ', function (accounts) {
  let userInfo
  let userAddress = accounts[4]
  let names = ['Flash Gordon', 'Buyer One', 'Buyer Two']
  let emails = ['flash@theuniver.se', 'accounts[1]@gmail.com', 'buyer2@gmail.com']
  let ipfsData = 'QmZW1CRFwc1RR7ceUtsaHjjb4zAjmXmkg29pQy7U1xxhMu'
  let tx

  /**
   * Three users are registered
   * A video is registered
   * accounts[0] owns the video
   * accounts[1:2] buy the video
   */

  it('should register a user', async function () {
    await setupParatiiContracts()
    tx = await userRegistry.create(accounts[0], names[0], emails[0], ipfsData)
    assert.equal(getInfoFromLogs(tx, '_address'), accounts[0])
    assert.equal(getInfoFromLogs(tx, '_name'), names[0])
    assert.equal(getInfoFromLogs(tx, '_email'), emails[0])
    assert.equal(getInfoFromLogs(tx, '_ipfsData'), ipfsData)

    userInfo = await userRegistry.get(accounts[0])
    assert.equal(userInfo[0], names[0])
    assert.equal(userInfo[1], emails[0])
    assert.equal(userInfo[2], ipfsData)
  })

  it('events are logged', async function () {
    await setupParatiiContracts()
    tx = await userRegistry.create(userAddress, names[0], emails[0], ipfsData)
    assert.equal(getInfoFromLogs(tx, '_address', 'LogCreateUser'), userAddress)
    assert.equal(getInfoFromLogs(tx, '_ipfsData', 'LogCreateUser'), ipfsData)
    tx = await userRegistry.remove(userAddress, {from: accounts[0]})
    assert.equal(getInfoFromLogs(tx, '_address', 'LogRemoveUser'), userAddress)
  })

  it('the owner can register and unregister', async function () {
    await setupParatiiContracts()
    await userRegistry.create(accounts[4], names[0], emails[0], ipfsData)
    await userRegistry.remove(accounts[4], {from: accounts[0]})
  })

  it('the user itself can register or unregister', async function () {
    await setupParatiiContracts()
    await userRegistry.create(accounts[4], names[0], emails[0], ipfsData)
    await userRegistry.remove(accounts[4], {from: accounts[4]})
  })

  it('an non-owner cannot register or unregister a user (other than itself)', async function () {
    await setupParatiiContracts()
    await expectError(async function () {
      await userRegistry.create(accounts[1], names[0], emails[0], ipfsData, {from: accounts[2]})
    })

    // now register a user and try to unregister it from another account
    await userRegistry.create(accounts[1], names[0], emails[0], ipfsData)

    await expectError(async function () {
      await userRegistry.remove(accounts[1], {from: accounts[2]})
    })
  })
})

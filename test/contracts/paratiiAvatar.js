import { expectError, paratiiAvatar, paratiiToken, setupParatiiContracts } from './utils.js'
const ParatiiAvatar = artifacts.require('./ParatiiAvatar.sol')
const ParatiiRegistry = artifacts.require('./ParatiiRegistry.sol')

contract('ParatiiAvatar', function (accounts) {
  it('owner can add to and remove from whitelist', async function () {
    let paratiiRegistry = await ParatiiRegistry.new()
    let paratiiAvatar = await ParatiiAvatar.new(paratiiRegistry.address)
    await paratiiAvatar.addToWhitelist(accounts[2])
    await paratiiAvatar.addToWhitelist(accounts[3])
    await paratiiAvatar.addToWhitelist(accounts[4])
    // assert.equal((await paratiiAvatar.whitelist(0)), 2)
    await paratiiAvatar.removeFromWhitelist(accounts[3])
    await paratiiAvatar.addToWhitelist(accounts[4])

    assert.equal(await paratiiAvatar.isOnWhiteList(accounts[1]), false)
    assert.equal(await paratiiAvatar.isOnWhiteList(accounts[2]), true)
    assert.equal(await paratiiAvatar.isOnWhiteList(accounts[3]), false)
    assert.equal(await paratiiAvatar.isOnWhiteList(accounts[4]), true)
  })

  it('can transfer tokens', async function () {
    await setupParatiiContracts()
    let sender = accounts[1]
    let receiver = accounts[2]
    let whitelistAccount = accounts[3]
    let amount = web3.toWei(14)

    // get the sender some PTI
    await paratiiToken.transfer(sender, Number(amount) + (1 * 10 ** 18))

    // PTI balance of receiver before the transaction
    // let senderBalance = await paratiiToken.balanceOf(sender)
    let receiverBalance = await paratiiToken.balanceOf(receiver)
    assert.equal(receiverBalance.valueOf(), 0)

    assert.equal(await paratiiAvatar.isOnWhiteList(whitelistAccount), false)
    await paratiiAvatar.addToWhitelist(whitelistAccount)
    assert.equal(await paratiiAvatar.isOnWhiteList(whitelistAccount), true)
    // the actualtransaction takes two steps:
    //  (1) give the paratiiAvatar an allowance to spend the amount fo the video
    await paratiiToken.approve(paratiiAvatar.address, Number(amount), {from: sender})
    assert.equal(Number(await paratiiToken.allowance(sender, paratiiAvatar.address)), amount)
    await expectError(async function () {
      await paratiiAvatar.transferFrom(sender, receiver, amount, {from: receiver})
    })

    //  (2) instruct the paratiiAvatar to actually buy the video (calling videoStore.buyVideo())
    await paratiiAvatar.transferFrom(sender, receiver, amount, {from: whitelistAccount})
    // let newSenderBalance = await paratiiToken.balanceOf(sender)
    receiverBalance = await paratiiToken.balanceOf(receiver)
    // TODO: why is this test commented?
//    assert.equal(newSenderBalance.valueOf(), Number(senderBalance.valueOf() - amount))
    assert.equal(receiverBalance.valueOf(), Number(amount))
  })
})

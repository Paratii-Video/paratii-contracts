import { expectError, avatar, paratiiToken, setupParatiiContracts } from './utils.js'
const Avatar = artifacts.require('./Avatar.sol')
const Registry = artifacts.require('./Registry.sol')

contract('Avatar', function (accounts) {
  it('owner can add to and remove from whitelist', async function () {
    let paratiiRegistry = await Registry.new()
    let avatar = await Avatar.new(paratiiRegistry.address)
    await avatar.addToWhitelist(accounts[2])
    await avatar.addToWhitelist(accounts[3])
    await avatar.addToWhitelist(accounts[4])
    // assert.equal((await avatar.whitelist(0)), 2)
    await avatar.removeFromWhitelist(accounts[3])
    await avatar.addToWhitelist(accounts[4])

    assert.equal(await avatar.isOnWhiteList(accounts[1]), false)
    assert.equal(await avatar.isOnWhiteList(accounts[2]), true)
    assert.equal(await avatar.isOnWhiteList(accounts[3]), false)
    assert.equal(await avatar.isOnWhiteList(accounts[4]), true)
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

    assert.equal(await avatar.isOnWhiteList(whitelistAccount), false)
    await avatar.addToWhitelist(whitelistAccount)
    assert.equal(await avatar.isOnWhiteList(whitelistAccount), true)
    // the actualtransaction takes two steps:
    //  (1) give the avatar an allowance to spend the amount fo the video
    await paratiiToken.approve(avatar.address, Number(amount), {from: sender})
    assert.equal(Number(await paratiiToken.allowance(sender, avatar.address)), amount)
    await expectError(async function () {
      await avatar.transferFrom(sender, receiver, amount, {from: receiver})
    })

    //  (2) instruct the avatar to actually buy the video (calling videoStore.buyVideo())
    await avatar.transferFrom(sender, receiver, amount, {from: whitelistAccount})
    // let newSenderBalance = await paratiiToken.balanceOf(sender)
    receiverBalance = await paratiiToken.balanceOf(receiver)
    // TODO: why is this test commented?
//    assert.equal(newSenderBalance.valueOf(), Number(senderBalance.valueOf() - amount))
    assert.equal(receiverBalance.valueOf(), Number(amount))
  })
})

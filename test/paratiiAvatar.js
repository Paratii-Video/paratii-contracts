import { expectError } from './utils.js'
const ParatiiAvatar = artifacts.require('./ParatiiAvatar.sol')
const ParatiiToken = artifacts.require('./ParatiiToken.sol')
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
    let paratiiRegistry = await ParatiiRegistry.new()
    let paratiiAvatar = await ParatiiAvatar.new(paratiiRegistry.address)
    let paratiiToken = await ParatiiToken.new({from: accounts[0]})
    let amount = web3.toWei(14)

    await paratiiAvatar.addToWhitelist(accounts[2])
    await expectError(async function() {
       await paratiiAvatar.transferFrom(accounts[0], accounts[1], amount, {from: web3.eth.accounts[1]})
    })

    let sender_balance = await paratiiToken.balanceOf(accounts[0].valueOf())
    let receiver_balance = await paratiiToken.balanceOf(accounts[1].valueOf())
    assert.equal(receiver_balance, 0)

//    await paratiiAvatar.transferFrom(accounts[0], accounts[1], Number(amount), {from: web3.eth.accounts[0]})

//    receiver_balance = await paratiiToken.balanceOf(accounts[1])
//    let new_sender_balance = await paratiiToken.balanceOf(accounts[0])
//    assert.equal(new_sender_balance.valueOf(), Number(sender_balance.valueOf() - amount))
//    assert.equal(receiver_balance.valueOf(), Number(amount))
  })
})

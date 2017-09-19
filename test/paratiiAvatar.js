const ParatiiAvatar = artifacts.require('./ParatiiAvatar.sol')
const ContractRegistry = artifacts.require('./ContractRegistry.sol')

contract('ParatiiAvatar', function (accounts) {
  it('owner can add to and remove from whitelist', async function () {
    let contractRegistry = await ContractRegistry.new()
    let paratiiAvatar = await ParatiiAvatar.new(contractRegistry.address)
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
    let contractRegistry = await ContractRegistry.new()
    let paratiiAvatar = await ParatiiAvatar.new(contractRegistry.address)
    await paratiiAvatar.addToWhitelist(accounts[2])
  })
})

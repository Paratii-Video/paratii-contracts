import {
  expectError,
  getInfoFromLogs,
  vouchers,
  setupParatiiContracts,
  paratiiToken
} from './utils.js'

contract('Vouchers: ', function (accounts) {
  let tx
  let voucher = 'some-random-string'
  let amount = 0.3141 * 10 ** 18

  before(async function () {
    await setupParatiiContracts()
    // first send some money to the vouchers contract, to distribute
    tx = await paratiiToken.transfer(vouchers.address, 1 * 10 ** 18)
  })

  it('the contract should work as expected', async function () {
    // calculate the hash
    let hashedVoucher = await vouchers.hashVoucher(voucher)
    assert.isOk(hashedVoucher)
    // now create the voucher on the contract for the value of 3.141 eth
    tx = await vouchers.create(hashedVoucher, amount)
    assert.equal(getInfoFromLogs(tx, '_hashedVoucher', 'LogCreateVoucher'), hashedVoucher)
    assert.equal((await vouchers.vouchers(hashedVoucher))[1], amount)

    // assert we have anough money to pay the redeemer
    assert.isOk(Number(await paratiiToken.balanceOf(vouchers.address)) >= amount)
    // we now have a voucher; lets try to redeem it
    tx = await vouchers.redeem(voucher, {from: accounts[2]})
    assert.equal(getInfoFromLogs(tx, '_claimant', 'LogRedeemVoucher'), accounts[2])

    // at this point, our balance (of claimant acccounts[2]) should have amount
    let balance = await paratiiToken.balanceOf(accounts[2])
    assert.equal(balance, amount)
  })

  it('non-existing vouchers cannot be redeemed', async function () {
    await expectError(function () {
      return vouchers.redeem('some-unknown-code', {from: accounts[2]})
    })
  })
  it('cannot redeem a voucher twice', async function () {
    let hashedVoucher = await vouchers.hashVoucher(voucher)
    await vouchers.create(hashedVoucher, amount)
    await vouchers.redeem(voucher, {from: accounts[2]})
    await expectError(function () {
      return vouchers.redeem(voucher, {from: accounts[2]})
    }, 'revert')
  })

  it('only the owner can add vouchers', async function () {
    await expectError(function () {
      return vouchers.create('some-new-code', amount, {from: accounts[2]})
    }, 'revert')
  })
})

import {
  setupParatiiContracts,
  ptiDistributor,
  paratiiToken,
  getInfoFromLogs
} from './utils.js'

contract('Distributor: ', function (accounts) {
  let address = accounts[2]
  let amount = 1 * 10 ** 18
  let reason = 'email'

  before(async function () {
    await setupParatiiContracts()

    await paratiiToken.transfer(ptiDistributor.address, 1 * 10 ** 18)
  })

  it('the contract should work as expected', async function () {
    // calculate the hash
    let distribute = await ptiDistributor.distribute(address, amount, reason)
    assert.equal(getInfoFromLogs(distribute, '_toAddress', 'LogDistribute'), accounts[2])
  })
})

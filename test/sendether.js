var SendEther = artifacts.require('./SendEther.sol')

contract('SentEther', function (accounts) {
  it('shoudl send ether and log the event', async function () {
    let token = await ParatiiToken.new()
    let pti = Math.pow(10, 18)
    let balance = await token.balanceOf(accounts[0])
        // we expect the initial balanace of the owner to be 21M * 18 point precision
    assert.equal(balance.valueOf(), 21000000 * pti)

        // when deploying the paratii contract
        // 70% of the tokens will distributed by a mining contract
        // the mining contract cannot spend more than 5000 tokens each day
    let miner = accounts[2]
    let limit = 5000 * pti
    let daylimitaccount = await DayLimitAccount.new(
            token.address,
            miner,
            limit)

        // check that contructor parameters are stored correctly
    let _limit = await daylimitaccount.limit()
    assert.equal(_limit, limit)
    let beneficary = await daylimitaccount.beneficary()
    assert.equal(beneficary, miner)

        // the daylimitaccount should have 5000 claimable tokens available
    let claimable = await daylimitaccount.claimable()
    assert.equal(claimable.valueOf(), limit)

        // transfer 70% of PTI to the dayly limited account
    await token.transfer(daylimitaccount.address, 0.7 * 21000000 * pti)
    balance = await token.balanceOf(miner)
    assert.equal(balance, 0)
    balance = await token.balanceOf(daylimitaccount.address)
    assert.equal(balance, 0.7 * 21000000 * pti)

        // we now claim whatever is due
    await daylimitaccount.claim()
        // since no time has passed, the limit (hwich is 5000) should have been claimed
    balance = await token.balanceOf(miner)
    assert.equal(balance.valueOf(), limit)

        // claiming again today should not result in any new transfer
    await daylimitaccount.claim()
    balance = await token.balanceOf(miner)
    assert.equal(balance, limit)

        // TODO: change the date on the blockchain to test how the contract behaves in time?
  })
})

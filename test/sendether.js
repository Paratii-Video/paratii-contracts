import { getValueFromLogs } from './utils.js'
var SendEther = artifacts.require('./SendEther.sol')

contract('SendEther', function (accounts) {
  it('should send ether and log the event', async function () {
    let ctt = await SendEther.new()
    let value = 40 * (10 ** 18)
    let description = 'I mean one thinks of it like being alive in a box, one keeps forgetting to take into account the fact that one is dead…which should make all the difference…shouldn\'t it?'
    let tx = await ctt.transfer(accounts[2], description, {from: accounts[1], value})
    assert.equal(getValueFromLogs(tx, 'from'), accounts[1])
    assert.equal(getValueFromLogs(tx, 'to'), accounts[2])
    assert.equal(getValueFromLogs(tx, 'value'), value)
    assert.equal(getValueFromLogs(tx, 'description'), description)
  })
})

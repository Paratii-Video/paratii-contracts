import { getValueFromLogs } from './utils.js'
var SendEther = artifacts.require('./SendEther.sol')

contract('SendEther', function (accounts) {
  it('should send ether and log the event', async function () {
    let ctt = await SendEther.new()
    let value = 40 * (10 ** 18)
    let tx = await ctt.transfer(accounts[2], 'a description', {value})
    assert.equal(getValueFromLogs(tx, 'to'), accounts[2])
    assert.equal(getValueFromLogs(tx, 'value'), value)
  })
})

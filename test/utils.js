const ParatiiRegistry = artifacts.require('./ParatiiRegistry')
const ParatiiAvatar = artifacts.require('./ParatiiAvatar')
const ParatiiToken = artifacts.require('./ParatiiToken')
const SendEther = artifacts.require('./SendEther')
const VideoRegistry = artifacts.require('./VideoRegistry')
const VideoStore = artifacts.require('./VideoStore')
export const NULL_HASH = '0x0000000000000000000000000000000000000000'

export let paratiiRegistry, paratiiAvatar, paratiiToken, sendEther, videoRegistry, videoStore

export function getInfoFromLogs (tx, arg, eventName, index = 0) {
  // tx.logs look like this:
  //
  // [ { logIndex: 13,
  //     transactionIndex: 0,
  //     transactionHash: '0x999e51b4124371412924d73b60a0ae1008462eb367db45f8452b134e5a8d56c8',
  //     blockHash: '0xe35f7c374475a6933a500f48d4dfe5dce5b3072ad316f64fbf830728c6fe6fc9',
  //     blockNumber: 294,
  //     address: '0xd6a2a42b97ba20ee8655a80a842c2a723d7d488d',
  //     type: 'mined',
  //     event: 'NewOrg',
  //     args: { _avatar: '0xcc05f0cde8c3e4b6c41c9b963031829496107bbb' } } ]
  //
  // if (eventName) {
  //   for (let i=0; i < tx.logs.length; i++) {
  //     if
  //   }
  // }
  if (eventName !== undefined) {
    for (let i = 0; i < tx.logs.length; i++) {
      if (tx.logs[i].event === eventName) {
        index = i
        break
      }
    }
    if (index === undefined) {
      let msg = `There is no event logged with eventName ${eventName}`
      throw msg
    }
  } else {
    if (index === undefined) {
      index = tx.logs.length - 1
    }
  }
  if (tx.logs[index] === undefined) {
    throw Error(`No log with index ${index} found in ${tx.logs}`)
  }
  let result = tx.logs[index].args[arg]
  if (result === undefined) {
    let msg = `This log does not seem to have a field "${arg}": ${tx.logs[index].args}`
    throw Error(msg)
  }
  return result
}

export async function expectError(f) {
  let expectedErrorMsg = 'Error: VM Exception while processing transaction: invalid opcode'

  try {
    await f()
  } catch(err) {
    assert.equal(String(err), expectedErrorMsg)
    return
  } 

  let msg = `Expected an error - function executed without error instead`
  throw Error(msg)
}

export async function setupParatiiContracts () {
  paratiiRegistry = await ParatiiRegistry.new()
  paratiiAvatar = await ParatiiAvatar.new(paratiiRegistry.address)
  paratiiToken = await ParatiiToken.new()
  sendEther = await SendEther.new()
  videoRegistry = await VideoRegistry.new()
  videoStore = await VideoStore.new(paratiiRegistry.address)
  paratiiRegistry.registerContract('ParatiiAvatar', paratiiAvatar.address)
  paratiiRegistry.registerContract('ParatiiToken', paratiiToken.address)
  paratiiRegistry.registerContract('SendEther', sendEther.address)
  paratiiRegistry.registerContract('VideoRegistry', videoRegistry.address)
  paratiiRegistry.registerContract('VideoStore', videoStore.address)
  // give 30 percent of eah video to the redistribution pool
  paratiiRegistry.registerNumber('VideoRedistributionPoolShare', web3.toWei(0.3))

  paratiiAvatar.addToWhitelist(videoStore.address)
  return paratiiRegistry
}

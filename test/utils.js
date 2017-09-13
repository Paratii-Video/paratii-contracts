const ContractRegistry = artifacts.require('./ContractRegistry')
const ParatiiAvatar = artifacts.require('./ParatiiAvatar')
const ParatiiToken = artifacts.require('./ParatiiToken')
const SendEther = artifacts.require('./SendEther')
const VideoRegistry = artifacts.require('./VideoRegistry')
const VideoStore = artifacts.require('./VideoStore')
export const NULL_HASH = '0x0000000000000000000000000000000000000000'

export let contractRegistry, paratiiAvatar, paratiiToken, sendEther, videoRegistry, videoStore

export function getValueFromLogs (tx, arg, eventName, index) {
  // logs look like this:
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
  if (index === undefined) {
    index = tx.logs.length - 1
  }
  let result = tx.logs[index].args[arg]
  if (!result) {
    let msg = `This log does not seem to have a field "${arg}": ${tx.logs[index].args}`
    throw msg
  }
  return result
}

export async function setupParatiiContracts () {
  contractRegistry = await ContractRegistry.new()
  paratiiAvatar = await ParatiiAvatar.new()
  paratiiToken = await ParatiiToken.new()
  sendEther = await SendEther.new()
  videoRegistry = await VideoRegistry.new()
  videoStore = await VideoStore.new(contractRegistry.address)
  contractRegistry.register('ParatiiAvatar', paratiiAvatar.address)
  contractRegistry.register('ParatiiToken', paratiiToken.address)
  contractRegistry.register('SendEther', sendEther.address)
  contractRegistry.register('VideoRegistry', videoRegistry.address)
  contractRegistry.register('VideoStore', videoStore.address)
  return contractRegistry
}


const Avatar = artifacts.require('./Avatar')
const Sales = artifacts.require('./Sales')
const Likes = artifacts.require('./Likes')
const Views = artifacts.require('./Views')
const Registry = artifacts.require('./Registry')
const ParatiiToken = artifacts.require('./ParatiiToken')
const SendEther = artifacts.require('./SendEther')
const Store = artifacts.require('./Store')
const Users = artifacts.require('./Users')
const Videos = artifacts.require('./Videos')
const Vouchers = artifacts.require('./Vouchers')

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const NULL_HASH = '0x0000000000000000000000000000000000000000'

export let
  sales,
  avatar,
  likes,
  paratiiRegistry,
  paratiiToken,
  sendEther,
  userRegistry,
  videoRegistry,
  store,
  views,
  vouchers

export async function expectError (f, expectedErrorMsg) {
  // let expectedErrorMsg = 'Error: VM Exception while processing transaction: invalid opcode'
  // let expectedErrorMsg = 'Error: VM Exception while processing transaction: revert'

  try {
    await f()
  } catch (err) {
    // assert.equal(String(err), expectedErrorMsg)
    if (expectedErrorMsg) {
      let msg = `Expected to find ${expectedErrorMsg}, got ${err} instead`
      assert(String(err).indexOf(expectedErrorMsg) >= 0, msg)
    }
    return
  }
  let errMsg = `Expected an error - function executed without error instead`
  throw Error(errMsg)
}

export async function setupParatiiContracts () {
  paratiiRegistry = await Registry.new()

  paratiiToken = await ParatiiToken.new()
  await paratiiRegistry.registerAddress('ParatiiToken', paratiiToken.address)

  sendEther = await SendEther.new()
  await paratiiRegistry.registerAddress('SendEther', sendEther.address)

  videoRegistry = await Videos.new(paratiiRegistry.address)
  await paratiiRegistry.registerAddress('Videos', videoRegistry.address)

  avatar = await Avatar.new(paratiiRegistry.address)
  await paratiiRegistry.registerAddress('Avatar', avatar.address)

  userRegistry = await Users.new(paratiiRegistry.address)
  await paratiiRegistry.registerAddress('Users', userRegistry.address)

  likes = await Likes.new(paratiiRegistry.address)
  await paratiiRegistry.registerAddress('Likes', likes.address)

  sales = await Sales.new(paratiiRegistry.address)
  await paratiiRegistry.registerAddress('Sales', sales.address)

  store = await Store.new(paratiiRegistry.address)
  await paratiiRegistry.registerAddress('Store', store.address)

  views = await Views.new(paratiiRegistry.address)
  await paratiiRegistry.registerAddress('Views', views.address)

  vouchers = await Vouchers.new(paratiiRegistry.address)
  await paratiiRegistry.registerAddress('Vouchers', vouchers.address)

  // give 30 percent of eah video to the redistribution pool
  await paratiiRegistry.registerUint('VideoRedistributionPoolShare', web3.toWei(0.3))

  await avatar.addToWhitelist(store.address)
  return paratiiRegistry
}

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
      } else {
        index = undefined
      }
    }
    if (index === undefined) {
      let msg = `There is no event "${eventName}" in the logs`

      if (tx.logs.length > 0) {
        msg += ' ('
        for (let i = 0; i < tx.logs.length; i++) {
          msg += tx.logs[i].event + ' '
        }
        msg += ')'
      }

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

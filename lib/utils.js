// some utility functions

export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const NULL_HASH = '0x0000000000000000000000000000000000000000000000000000000000000000'

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

export function getDefaultAccount () {
    // TODO: this should be the default sender account that signs the transactions
  return web3.eth.accounts[0]
}

export const ExtendTruffleContract = (superclass) => class {
  constructor (contract) {
    this.contract = contract
    for (var i in this.contract) {
      if (this[i] === undefined) {
        this[i] = this.contract[i]
      }
    }
    // for (var prop in this.contract) {
    //   if (!this.hasOwnProperty(prop)) {
    //     this[prop] = superclass[prop];
    //   }
    // }
  }

  static async new () {
    let contract = await superclass.new()
    return new this(contract)
  }

  static async at (address) {
    return new this((await superclass.at(address)))
  }

  static async deployed () {
    return new this(await superclass.deployed())
  }
}

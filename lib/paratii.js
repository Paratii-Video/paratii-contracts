var ParatiiToken = artifacts.require('./ParatiiToken.sol')
var ParatiiAvatar = artifacts.require('./ParatiiAvatar.sol')
var ParatiiRegistry = artifacts.require('./ParatiiRegistry.sol')
var SendEther = artifacts.require('./SendEther.sol')
var UserRegistry = artifacts.require('./UserRegistry.sol')
var VideoRegistry = artifacts.require('./VideoRegistry.sol')
var VideoStore = artifacts.require('./VideoStore.sol')

/**
 * Paratii Library
 *
 */

const Paratii = (function () {
  let PARATIIREGISTRYADDRESS

  const CONTRACTS = {
    'ParatiiAvatar': {
      spec: ParatiiAvatar
    },
    'ParatiiRegistry': {
      spec: ParatiiRegistry
    },
    'ParatiiToken': {
      spec: ParatiiToken
    },
    'SendEther': {
      spec: SendEther
    },
    'UserRegistry': {
      spec: UserRegistry
    },
    'VideoRegistry': {
      spec: VideoRegistry
    },
    'VideoStore': {
      spec: VideoStore
    }
  }

  async function deployParatiiContracts () {
    // TODO: this is basically a copy of the migration of the paratii-contracts repo. We need a way to deduplicate this code
    let paratiiRegistry = await ParatiiRegistry.new()
    let paratiiAvatar = await ParatiiAvatar.new(paratiiRegistry.address)
    let paratiiToken = await ParatiiToken.new()
    let sendEther = await SendEther.new()
    let userRegistry = await UserRegistry.new(paratiiRegistry.address)
    let videoRegistry = await VideoRegistry.new()
    let videoStore = await VideoStore.new(paratiiRegistry.address)

    console.log(`registering contracts at the ParatiiRegistry at ${paratiiRegistry.address}`)
    await paratiiRegistry.registerAddress('ParatiiAvatar', paratiiAvatar.address, {from: web3.eth.accounts[0]})
    await paratiiRegistry.registerAddress('ParatiiToken', paratiiToken.address, {from: web3.eth.accounts[0]})
    await paratiiRegistry.registerAddress('SendEther', sendEther.address, {from: web3.eth.accounts[0]})
    await paratiiRegistry.registerAddress('VideoRegistry', videoRegistry.address, {from: web3.eth.accounts[0]})
    await paratiiRegistry.registerAddress('VideoStore', videoStore.address, {from: web3.eth.accounts[0]})
    await paratiiRegistry.registerAddress('UserRegistry', userRegistry.address)
    console.log('registering contracts done')

    await paratiiRegistry.registerUint('VideoRedistributionPoolShare', web3.toWei(0.3))

    paratiiAvatar.addToWhitelist(videoStore.address)

    let result = {
      ParatiiAvatar: paratiiAvatar,
      ParatiiRegistry: paratiiRegistry,
      ParatiiToken: paratiiToken,
      SendEther: sendEther,
      UserRegistry: userRegistry,
      VideoRegistry: videoRegistry,
      VideoStore: videoStore
    }

    return result
  }

  async function getContract (name) {
    let contractInfo = CONTRACTS[name]
    if (!contractInfo) {
      throw Error(`No contract with name "${name}" is known`)
    }
    let address = await getContractAddress(name)
    if (address) {
      const contract = contractInfo.spec.at(address)
      return contract
    }
  }

  // TODO: optimization: do not ask the contract addresses from the registry each time, only on startup/first access
  async function getContractAddress (name) {
    if (name === 'ParatiiRegistry') {
      return getRegistryAddress()
    }
    try {
      let address = await getParatiiRegistry().getContract(name)
      return address
    } catch (err) {
      console.log(err)
    }
  }

  async function getParatiiContracts () {
    let contracts = {}
    // TODO: use CONTRACTS here to get the names
    let contractNames = [
      'ParatiiAvatar',
      'ParatiiToken',
      'ParatiiRegistry',
      'SendEther',
      'UserRegistry',
      'VideoRegistry',
      'VideoStore'
    ]
    for (let i = 0; i < CONTRACTS.length; i++) {
      contracts[contractNames[i]] = await getContract(contractNames[i])
    }
    return contracts
  }
  function getParatiiRegistry () {
    let address = getRegistryAddress()
    if (!address) {
      let msg = `No paratii registry address known!`
      throw Error(msg)
    }
    return ParatiiRegistry.at(address)
  }

  function getRegistryAddress () {
    return PARATIIREGISTRYADDRESS
  }

  async function getOrDeployContracts () {
    let contracts
    if (PARATIIREGISTRYADDRESS) {
      contracts = await getParatiiContracts()
    } else {
      contracts = await deployParatiiContracts()
      PARATIIREGISTRYADDRESS = contracts['ParatiiRegistry'].address
    }
    return contracts
  }

  return {
    getContract,
    getContractAddress,
    getOrDeployContracts,
    getRegistryAddress
  }
}())

export { Paratii }

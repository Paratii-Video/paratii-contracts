import { requireContract } from './utils.js'
var ParatiiToken = requireContract('ParatiiToken')
var ParatiiAvatar = requireContract('ParatiiAvatar')
var ParatiiRegistry = requireContract('ParatiiRegistry')
var SendEther = requireContract('SendEther')
var UserRegistry = requireContract('UserRegistry')
var VideoRegistry = requireContract('VideoRegistry')
var VideoStore = requireContract('VideoStore')
// var VideoStore = artifacts.require('./ParatiiToken.sol')
// var ParatiiAvatar = artifacts.require('./ParatiiAvatar.sol')
// var ParatiiRegistry = artifacts.require('./ParatiiRegistry.sol')
// var SendEther = artifacts.require('./SendEther.sol')
// var UserRegistry = artifacts.require('./UserRegistry.sol')
// var VideoRegistry = artifacts.require('./VideoRegistry.sol')
// var VideoStore = artifacts.require('./VideoStore.sol')

/**
 * Paratii Library
 *
 */

const Paratii = (function () {
  let PARATIIREGISTRYADDRESS
  const CONTRACTS = {
    'ParatiiAvatar': {
      contract: ParatiiAvatar
    },
    'ParatiiRegistry': {
      contract: ParatiiRegistry
    },
    'ParatiiToken': {
      contract: ParatiiToken
    },
    'SendEther': {
      contract: SendEther
    },
    'UserRegistry': {
      contract: UserRegistry
    },
    'VideoRegistry': {
      contract: VideoRegistry
    },
    'VideoStore': {
      contract: VideoStore
    }
  }

  function init (opts) {
    if (opts.registryAddress === undefined) {
      throw Error('you must provide a registryAddres')
    }
    console.log('\n------ opts -----', opts)
    PARATIIREGISTRYADDRESS = opts.registryAddress
    // if (!opts.provider) {
    //   opts.provider = 'http://localhost:8545'
    // }
    // let provider = new Web3.providers.HttpProvider(opts.provider)
    // for (let contractName in CONTRACTS) {
    //   CONTRACTS[contractName].contract.setProvider(provider)
    // }
  }

  async function deployParatiiContracts () {
    let paratiiRegistry = await ParatiiRegistry.new()
    if (!paratiiRegistry.address) {
      throw Error('Could not deploy ParatiiRegistry!')
    }
    let paratiiAvatar = await ParatiiAvatar.new(paratiiRegistry.address)
    let paratiiToken = await ParatiiToken.new()
    let sendEther = await SendEther.new()
    let userRegistry = await UserRegistry.new(paratiiRegistry.address)
    let videoRegistry = await VideoRegistry.new()
    let videoStore = await VideoStore.new(paratiiRegistry.address)

    await paratiiRegistry.registerAddress('ParatiiAvatar', paratiiAvatar.address)
    await paratiiRegistry.registerAddress('ParatiiToken', paratiiToken.address)
    await paratiiRegistry.registerAddress('SendEther', sendEther.address)
    await paratiiRegistry.registerAddress('VideoRegistry', videoRegistry.address)
    await paratiiRegistry.registerAddress('VideoStore', videoStore.address)
    await paratiiRegistry.registerAddress('UserRegistry', userRegistry.address)

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
      const contract = contractInfo.contract.at(address)
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

  async function getOrDeployContracts (flag) {
    let contracts
    if (PARATIIREGISTRYADDRESS && flag !== 'deploy') {
      contracts = await getParatiiContracts()
    } else {
      console.log('deploying new contracts')
      contracts = await deployParatiiContracts()
      console.log('setting registry address')
      PARATIIREGISTRYADDRESS = contracts['ParatiiRegistry'].address
    }
    return contracts
  }

  return {
    getContract,
    getContractAddress,
    getOrDeployContracts,
    getRegistryAddress,
    init
  }
}())

export { Paratii }

// // import { web3 } from './web3.js'
// //
// // TODO: just use 'artifacts.require' here
// import ParatiiAvatarSpec from '../build/contracts/ParatiiAvatar.json'
// import ParatiiRegistrySpec from '../build/contracts/ParatiiRegistry.json'
// import ParatiiTokenSpec from '../build/contracts/ParatiiToken.json'
// import SendEtherSpec from '../build/contracts/SendEther.json'
// import VideoRegistrySpec from '../build/contracts/VideoRegistry.json'
// import VideoStoreSpec from '../build/contracts/VideoStore.json'
//
// const CONTRACTS = {
//   'ParatiiAvatar': {
//     spec: ParatiiAvatarSpec
//   },
//   'ParatiiRegistry': {
//     spec: ParatiiRegistrySpec
//   },
//   'ParatiiToken': {
//     spec: ParatiiTokenSpec
//   },
//   'SendEther': {
//     spec: SendEtherSpec
//   },
//   'VideoRegistry': {
//     spec: VideoRegistrySpec
//   },
//   'VideoStore': {
//     spec: VideoStoreSpec
//   }
// }
//
// export function setRegistryAddress (address) {
// //   // Meteor.settings.public.ParatiiRegistry = address
// }
// //
// export function getRegistryAddress () {
// //   // return Meteor.settings.public.ParatiiRegistry
// }
// //
// export function getParatiiRegistry () {
//   let address = getRegistryAddress()
//   if (!address) {
//     let msg = `No paratii registry address known!`
//     throw Error(msg)
//   }
//   return web3.eth.contract(ParatiiRegistrySpec.abi).at(address)
// }
//
// // // TODO: optimization: do not ask the contract addresses from the registry each time, only on startup/first access
// export async function getContractAddress (name) {
//   if (name === 'ParatiiRegistry') {
//     return getRegistryAddress()
//   }
//   try {
//     let address = await getParatiiRegistry().getContract(name)
//     // console.log(`contract ${name} is located at ${address}`)
//     return address
//   } catch (err) {
//     console.log(err)
//   }
// }
//
// export async function getContract (name) {
//   let contractInfo = CONTRACTS[name]
//   if (!contractInfo) {
//     throw Error(`No contract with name "${name}" is known`)
//   }
//   let address = await getContractAddress(name)
//   if (address) {
//     const contract = web3.eth.contract(contractInfo.spec.abi).at(address)
//     return contract
//   }
// }
//
// export async function getParatiiContracts () {
//   let contracts = {}
//   let contractNames = [
//     'ParatiiAvatar',
//     'ParatiiToken',
//     'ParatiiRegistry',
//     'SendEther',
//     'VideoRegistry',
//     'VideoStore'
//   ]
//   for (let i = 0; i < contractNames.length; i++) {
//     contracts[contractNames[i]] = await getContract(contractNames[i])
//   }
//   return contracts
// }

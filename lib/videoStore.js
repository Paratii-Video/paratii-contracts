import { getContract } from './paratii'
import { getWeb3 } from './utils'
import lightwallet from 'eth-lightwallet/dist/lightwallet.js'

// TODO - rather than pass in keystore and userPTIAddress, could reference it from paratii-player, as this lib is injected into paratii-player:
// import sendTransaction from '/imports/lib/etherem/wallet'
// import getUserPTIAddress from '/imports/api/user'

var promisify = require('promisify-node')
const web3 = getWeb3()
// TODO: store all this information in a settings.json object
const GAS_PRICE = 50000000000
const GAS_LIMIT = 4e6

// Note - unlockAndBuyVideo code taken from paratii-player/imports/ui/components/unlockVideo
export async function unlockAndBuyVideo (videoId, price, password, keystore, userPTIAddress) {
    // consider making a type-checking module that can be used across the API and librart
  if (typeof videoId !== 'number') throw Error(`argument 'videoId' to unlockAndBuyVideo was of type ${typeof videoId} but 'Number' was expected`)
  if (typeof price !== 'number') throw Error(`argument 'price' to unlockAndBuyVideo was of type ${typeof price} but 'Number' was expected`)
  if (typeof password !== 'string') throw Error(`argument 'password' to unlockAndBuyVideo was of type ${typeof password} but 'Number' was expected`)
    // typeof keystore, userPTIAddress

  let errors = []

    // This transaction has 3 main steps:

    // 1 Get the video from Video Registry
    // 2 Approve that the paratiiavatar can move `price`
    // 3 Instruct the videoStore to buy the video

    // 1. Get the video from Video Registry
  let videoRegistry = await getContract('VideoRegistry')
  console.log('videoRegistry located at:', videoRegistry.address)

  let videoInfo = await videoRegistry.getVideoInfo(videoId)
  if (!videoInfo) throw Error(`call to videoRegistry for video ${videoId} failed`)

  console.log('VideoInfo from registry:', videoInfo)
  if (videoInfo[0] === '0x0000000000000000000000000000000000000000') {
    throw Error(`A video with id ${videoId} was not found in the registry`)
  }
  console.log(`price from BC: ${Number(videoInfo[1])}`)

    // 2. Approve that the paratiiavatar can move `price`
  let paratiiAvatar = await getContract('ParatiiAvatar')
  console.log(`approve ${price}`, price)
  await promisify(sendTransaction)(password, 'ParatiiToken', 'approve', [paratiiAvatar.address, price], 0)

  let paratiiToken = await getContract('ParatiiToken')
  console.log('allowance:', Number(await paratiiToken.allowance(userPTIAddress(), paratiiAvatar.address)))

    // 3. Instruct the videoStore to buy the video
  console.log(`now calling buyVideo on the videoStore contract for video ${videoId}`)

  sendTransaction(password, 'VideoStore', 'buyVideo', [videoId], 0, keystore, userPTIAddress, function (error, result) {
    if (error) {
      errors.push(error)
      return errors
    } else {

    }
  })
    // await contracts.VideoStore.isAcquired(videoId)
}

function sendTransaction (password, contractName, functionName, args, value, keystore, userPTIAddress, callback) {
    // send some ETH or PTI
    // @param value The amount of ETH to transfer (expressed in Wei)
    //
  if (!value) {
    value = 0
  }
  if (!args) {
    args = []
  }
  console.log(`Sending transaction: ${contractName}.${functionName}(${args}), with value ${value} ETH`)
  const fromAddr = userPTIAddress // or needs be passed in as arg to get in scope ****
  const nonce = web3.eth.getTransactionCount(fromAddr)
  keystore.keyFromPassword(password, async function (error, pwDerivedKey) {
    let contract
    if (error) throw error
    // sign the transaction
    const txOptions = {
      nonce: web3.toHex(nonce),
      gasPrice: web3.toHex(GAS_PRICE),
      gasLimit: web3.toHex(GAS_LIMIT)
    }

    let rawTx
    contract = await getContract(contractName)
    txOptions.to = contract.address
    txOptions.value = web3.toHex(value)
    rawTx = lightwallet.txutils.functionTx(contract.abi, functionName, args, txOptions)
    console.log('Signing transaction')
    // console.log(fromAddr)
    const tx = lightwallet.signing.signTx(keystore, pwDerivedKey, rawTx, fromAddr)
    web3.eth.sendRawTransaction(`0x${tx}`, function (err, hash) {
      console.log('Transaction sent: calling callback', callback)
      if (callback) {
        callback(err, hash)
      } else {
        if (err) {
          throw err
        }
      }
    })
  })
}

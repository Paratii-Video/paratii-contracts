import { getContract } from './paratii'
import { getKeystore, sendTransaction } from './wallet'

// TODO import getUserPTIAddress from '/imports/api/user'

var promisify = require('promisify-node')

// Note - unlockAndBuyVideo code taken from paratii-player/imports/ui/components/unlockVideo
export async function unlockAndBuyVideo (videoId, price, password, userPTIAddress) {
  // consider making a type-checking module that can be used across the API and librart
  if (typeof videoId !== 'number') throw Error(`argument 'videoId' to unlockAndBuyVideo was of type ${typeof videoId} but 'Number' was expected`)
  if (typeof price !== 'number') throw Error(`argument 'price' to unlockAndBuyVideo was of type ${typeof price} but 'Number' was expected`)
  if (typeof password !== 'string') throw Error(`argument 'password' to unlockAndBuyVideo was of type ${typeof password} but 'Number' was expected`)

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
  console.log('allowance:', Number(await paratiiToken.allowance(userPTIAddress, paratiiAvatar.address)))

    // 3. Instruct the videoStore to buy the video
  console.log(`now calling buyVideo on the videoStore contract for video ${videoId}`)

  const keystore = getKeystore()
  sendTransaction(password, 'VideoStore', 'buyVideo', [videoId], 0, keystore, userPTIAddress, function (error, result) {
    if (error) {
      errors.push(error)
      return errors
    } else {

    }
  })
  // await contracts.VideoStore.isAcquired(videoId)
}

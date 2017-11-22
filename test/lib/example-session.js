import { Paratii } from '../../lib/paratii.js'

contract('Paratii API:', function () {
  it('example session from ../docs/example-session.md should work', async function () {
    let paratii = Paratii()
    //
    // // paratii.init()
    let contracts = await paratii.deployContracts()

    //

    let initialBalance = await contracts.ParatiiToken.balanceOf(web3.eth.accounts[0]) // 210000000
    assert.equal(initialBalance.valueOf(), 21 * 10 ** (6 + 18))
    // // tests...
    //
    // // USER
    // await contracts.UserRegistry.registerUser('0x12455', 'Marvin Pontiac', 'john@lurie.com', '/img/avatar_img.svg') // tx: receipt: logs:
    //
    // const userInfo = await contracts.UserRegistry.getUserInfo('0x12455') // [ 'Marvin Pontiac', 'john@lurie.com', 'myAvatar' ]
    // assert(userInfo[0], 'Marvin Pontiac')
    // // tests...
    //
    // // VIDEO
    // await contracts.VideoRegistry.registerVideo(
    //   '31415', // id of the video
    //   '0x123455', // address of the video owner
    //   27182, // price (in PTI "wei")
    //   'ladsfkjasdfkljfl' // hash of the video on IPFS
    // )
    //
    // const video = await contracts.VideoRegistry.getVideoInfo('31415') // [address, string, ...]
    // assert(video[0], 0x123455)
    // // tests...
    //
    // // VIDEOSTORE
    // // await contracts.VideoStore.buyVideo('31415') // 'could not unlock signer account'
    // // await contracts.VideoStore.buyVideo('31415', { from : '0x0000000000000000000000000000000000012455' }) // Error: could not unlock signer account
    // // const answer = await paratii.contracts.VideoStore.isAcquired('31415')
    // // console.log('==== answer ====', answer)
  })
})

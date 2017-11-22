import { Paratii } from '../../lib/paratii.js'

contract('Paratii API:', function (accounts) {
  it('example session from ../docs/example-session.md should work', async function () {
    let paratii, contracts
    paratii = Paratii
    // paratii.init()
    contracts = await paratii.getOrDeployContracts()

    // BALANCE
    const balance = await contracts.ParatiiToken.balanceOf(web3.eth.accounts[0])
    assert.equal(balance.c[0], 210000000000)

    // USER
    await contracts.UserRegistry.registerUser('0x123455', 'Marvin Pontiac', 'john@lurie.com', '/img/avatar_img.svg')

    const userInfo = await contracts.UserRegistry.getUserInfo('0x123455')
    let user = {
      name: userInfo[0],
      email: userInfo[1],
      avatar: userInfo[2]
    }
    assert.equal(user.name, 'Marvin Pontiac')
    assert.equal(user.email, 'john@lurie.com')
    assert.equal(user.avatar, '/img/avatar_img.svg')

    // VIDEO
    await contracts.VideoRegistry.registerVideo(
      '31415', // id of the video
      '0x123455', // address of the video owner
      27182, // price (in PTI "wei")
      'ladsfkjasdfkljfl' // hash of the video on IPFS
    )

    const video = await contracts.VideoRegistry.getVideoInfo('31415')
    assert.equal(video[0], '0x0000000000000000000000000000000000123455')

    // VIDEOSTORE - troubleshooting, next line fails
    // await contracts.VideoStore.buyVideo('31415') // Error: VM Exception while processing transaction: revert // Error: VM Exception while processing transaction: invalid opcode
    // await contracts.VideoStore.buyVideo('31415', { from : account})  // Error: invalid address // { from : 0x00000000000000000000000000000000000123455 }) // invalid address
    // await contracts.VideoStore.buyVideo('31415', { from : '0x00000000000000000000000000000000000123455'}) // Error: could not unlock signer account
    // await contracts.VideoStore.buyVideo('31415', { from : 0x123455})  // Error: invalid address // { from : 0x0000000000000000000000000000000000012455 }) // invalid address

    // await contracts.VideoStore.isAcquired('31415') // TODO isAcquired is not a smart contract method, write it
    // await contracts.UserRegistry.isAcquired('0x123455', '31415')
    // , gas: 210000, gasPrice: 20000000000z
  })
})

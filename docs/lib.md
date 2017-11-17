
# Paratii Library

Work in progress.  

Install via `npm install paratii-contracts` ** <-- once issue #27 will be resolved **

## API


## Example Session
[next examples are not all working yet, but this is what is should/could look like]

If you want to try the next session out, make sure you have testrpc running fo

    import { Paratii } from 'paratii-contracts';

We can now deploy the paratii contracts:

    contracts = await paratii.deployAllContracts()


At this point, all Paratii contracts will be available in `paratii.contracts`, under their class names.

 A fresh  `ParatiiToken` contract will hav been deployed. Because you deployed it, you will have all the tokens:

    await paratii.contracts.ParatiiToken.balanceOf(web3.eth.accounts[0])

shoud return a number starting with 21 and followed by many zeros.

We can register a new user on the UserRegistry:

    await paratii.contracts.UserRegistry.registerUser('0x12455', 'Marvin Pontiac', 'john@lurie.com')

And check if the name is correctly registered.

    (await paratii.contracts.UserRegistry.getUserInfo('id-of-this-user')).name

We can also register a video:

    await paratii.contracts.VideoRegistry.registerVideo(
      '31415', // id of the video
      '0x123455', // address of the video owner
      27182, // price (in PTI "wei")
      'ladsfkjasdfkljfl', // hash of the video on IPFS
    )

And read the video information back from the blockchain:

    await paratii.contracts.VideoRegistry.getVideoInfo('31415'))


We are now ready to buy a video (if you have anough PTI)

    await paratii.contracts.VideoStore.buyVideo('31415')

The `buyVideo` call will check the preconditions (whether the sender has enough ETH and PTI to do the transaction, if the video exists and is for sale) and throw meaningful errors if the preconditions are not met. If indeed the preconditions are met, the function will then initiate a series of transactions on the blockchain to actually acquire the video. If the operation is successful, we can do

    await paratii.contracts.VideoStore.isAcquired('31415')

to check if we have acquired the video.


This ends the sample session.


## The Paratii Object

### importing


    import { Paratii } from 'paratii-contracts';

Or, if ES6 is not available:

    Paratii = require('paratii-contracts').Paratii


### initialization

The Paratii object serves as the general entry point for interacting with the family of Paratii contracts that are deployed on the blockchain. It can be initialized in several ways. Here is an example:

    paratii =  Paratii() // connect to the default node (http://localhost:8754)

  Or with particular options, such as the following:

    paratii = Paratii({
      provider: 'chain.paratii.video', // optional - the address of an ethereum node (defaults to localhost:8754)
      registry: '0x23445abcdefg', // optional - the address where the Paratii Contract registry can be found
    })

### deploying contracts

  contracts = await paratii.deployAllContracts()

  contracts = await paratii.deployAllContracts({owner: '0x1234435'})

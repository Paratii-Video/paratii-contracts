# Paratii Contracts


The paratii system consists of a number of interacting contracts.

[ParatiiToken.sol](./contracts/paratii/ParatiiToken.sol):
Central to the system is the ParatiiToken contract. This is a standard ERC20 token contract.

[ParatiiAvatar.sol](./contracts/paratii/ParatiiAvatar.sol):
The Paratii DAO will receive and redistribute PTI from the token contract. The ParatiiAvatar.sol is the account in ParatiiToken that is used by the DAO to hold PTI.


[VideoRegistry.sol](./contracts/paratii/VideoRegistry.sol): contains information about videos: their IPFS hash, its owner, and the price. The idea is that this contract only contains essential information:  is that additional data (duration, license, descriptions, etc etc) can be stored in IPFS. (This will not be implemented in the MVP))


[VideoStore.sol](./contracts/paratii/VideoStore.sol): The Videostore is the place where videos can be bought/sold. To do this, the user must initiate two transactions:

  * the client calls `ParatiiToken.approve(ParatiiAvatar.address, price_of_video)` to allows the paratiiAvatar to transfer the price_of_video. (For small transactions, this can be done transparently)
  * the client calls `VideoStore.buyVideo(videoId)`, triggering a number of steps:
    - the price of the video will be transfered to the paratiiAvatar
    - an event will be logged that the video is unlocked for this user
    - [not implement yet, we will use the event as a witness for payment in the first iteraration] the fact that the user has bought the video is registered on the blockchain (where?)
    - a part of the price will be transfered (immediately?) to the owner, other goes tot he redistrubtion pool. (In the first iteration, we can give all money to thee owner)




[ContractRegistry.sol](./contracts/paratii/ContractRegistry.sol): Given that we expect the contracts to be upgraded regularly, the contractregistry will contain the addrsses of the latest deployed contracts. We epect only 3 contract to remain unchanged FOREVER: ParatiiToken, ParatiiAvatar and ContractRegistry.



[SendEther.sol](./contracts/paratii/SendEther.sol):
is a small utility contract that is used to send ETH from the application. In addition to sending ETH, it logs an event, which can be read by the client for adding the ETH transaction to the transaction history.

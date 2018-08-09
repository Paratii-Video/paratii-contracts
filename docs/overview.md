# Overview of the Paratii contracts and library



- InterPlanetary Linked Data (IPLD) for formatting metadata under cross-industry standards.

## Relevant Levels of Data

- message: encompass wantlists, block references, chunk hashes, payload, signed / non-signed **(to be spec'd)**.
- chunk: the data unit of storage at the heart of content-addressing, determiniscally pointed to by a unique hash. Relevant to storage operations, besides delivery/request and accounting.  
- address: unique identifier of an agent in the network.
- video: an IPFS multihash, relevant to high-level APIs.

## Message formats

The Paratii protocol is message-based, as opposed to request-response. It used IPFS' PKI-based identity, and messages are signed using the same private key used to create the `nodeID`, allowing for receivers to get the public key out of the signature and check it against that of the requesting node.

Deep down, messages are stringified JSON objects, to be parsed back by receivers. To define them, we first outline _Fragments_. These are main building blocks, suited for requesting a job upon a payload (e.g. transcoding a file):

    message Fragment {
      optional bytes tid = 1;
      optional int32 type = 2;
      optional bytes payload = 3;
      optional bytes args = 4;
    }
    
| Field         | Type          | Description  |
| ------------- |:-------------:| ----       |
| `id`          | `bytes`       | The `nodeID`.   |
| `type`        | `int32`       | `command` or `response`, signed.  |
| `payload`     | `bytes`       | The actual command. e.g. a transcoding `jobRequest`.     |
| `args`        | `bytes`       | The arguments for the command. E.g. a video file multihash. In the case of a `response` type, `args` holds the response itself.      |


Or for peers to announce their conditions to party into a chequebook contract for data exchange, as [Swarm](https://github.com/ethersphere/swarm/wiki/Swap-demo-instructions) does:

    message Hello {
      required bytes eth = 1;
      optional uint32 dropAt = 2;
      optional uint32 payAt = 3;
      optional uint32 buyAt = 4;
      optional uint32 sellAt = 5;
    }
    
| Field         | Type          | Description  |
| ------------- |:-------------:| :-------       |
| `eth`         | `bytes`       | The node's ethereum address.   |
| `dropAt`      | `uint32`      | How many blocks of data the peer is willing to send without getting paid upfront.|
| `payAt`       | `uint32`      | How many blocks of data this peer wants to pays for at a time, per transaction.     |
| `buyAt`       | `uint32`      | How much it's willing to pay for a block of data.     |
| `sellAt`      | `uint32`      | How much it's willing to sell a block of data for.       |

**(WIP HERE)** 
_Fragments_ are then wrapped up in a bigger message that has metadata like pti address , signature and things like that.

    message Message {
    message Hello {
      required bytes eth = 1;
      optional uint32 dropAt = 2;
      optional uint32 payAt = 3;
      optional uint32 buyAt = 4;
      optional uint32 sellAt = 5;
    }

    message Fragment {
      optional bytes tid = 1;
      optional int32 type = 2;
      optional bytes payload = 3;
      optional bytes args = 4;
    }

    optional Hello hello = 1;
    repeated Fragment fragments = 2;
    }

Nodes running the `paratii-protocol` are connected over libp2p and suited to do a basic set of operations:

**(WIP HERE)**
- Encode a message as in IPFS protobuf, transforming it into a series of key-value pairs and concatenating them into a bytestream.
- Exchange and verify a message (`get`/`put` PTI/ETH address; checks if it's a valid account).
- Deal with payload **(arbitrary commands to be spec'd)**, which can be a multihash in the case of a video (chunks a file into 1mb chunks, hashes them, seeks for the closest transcoding node, sends a jobRequest and asks for the chunks to be `get`, the transcoding node uploads its job to IPFS and gives back its multihash along links for thumbs/screenshots).

## Smart Contracts
The system can be broken down into *administrative* contracts that primarily deal with the core infrastructure, and a series of *action* contracts that interact with users, videos, and metadata.

The following define Paratii's *administrative* contracts:

### ParatiiRegistry 
The [ParatiiRegistry.sol](https://github.com/Paratii-Video/paratii-contracts/blob/master/contracts/paratii/ParatiiRegistry.sol) contract is a simple key-value store on the blockchain that holds Paratii general settings. In particular, this is the place where the addresses of the deployed Paratii contracts are stored.

For example, the following call will get the address of the `ParatiiToken` contract:

    let paratiiRegistery = paratii.contracts.ParatiiRegistry
    paratiiRegistry.getAddress('ParatiiToken')`
    
The `ParatiiRegistry` is an `Ownable` contract, and contains simple setters and getters for several solidity types:

    ParatiiRegistry.setAddress('UserRegistry', '0x12345') // can only be called by the owner of the contract instance
    ParatiiRegistry.setUint('a-useful-constant', 99999)
    ParatiiRegistry.getUint('a-useful-constant') // will return 99999
    
### ParatiiToken

[ParatiiToken.sol](https://github.com/Paratii-Video/paratii-lib/blob/master/contracts/paratii/ParatiiToken.sol) is an ERC20 token contract and contains the balances of all Paratii account holders.

    paratiToken.balanceOf('0x123') // will return the balance of the given address
    
### ParatiiAvatar

[ParatiiAvatar.sol](https://github.com/Paratii-Video/paratii-lib/blob/master/contracts/paratii/ParatiiAvatar.sol) is a contract that can send and receive ETH and other ERC20 tokens, designed to collect and desimburse redistribution funds. It is controlled by a number of whitelisted addresses.

    erc20Token = 0x12345667
    paratiiAvatar.transferFrom(erc20Token, fromAddress, toAddress, amount) // will fail because you are not whitelisted
    paratiiAvatar.addToWhitelist(0x22222222)
    paratiiAvatar.transferFrom(erc20Token, fromAddress, toAddress, amount, { from: 0x22222222}) // sender is 0x2222, whihc is in the whitelist
    paratiiAvatar.transfer(toAddress, amount) // transfer some ether to toAddress
    
These contracts are expected to remain unchanged. By contrast, the *action* contracts may be updated, and are expected to grow in number as Paratii develops new features. *Administrative* contracts interact with a series of *action* contracts in a simple pattern:
1. Trigger one or more `web.js` hooks through an `Event`.
2. Log the interaction within Paratii's [metadata database](../Paratii-Protocol/Metadata-Storage.md).

These *action* contracts currently are:

### UserRegistry

A registry with information about users: user metadata, upvote/downvote history, ownership of videos.

### VideoRegistry

[VideoRegistry.sol](https://github.com/Paratii-Video/paratii-contracts/blob/master/contracts/paratii/VideoRegistry.sol) contains information about videos: their IPFS hash, its owner, and the price. This contract only stores essential information: additional metadata (duration, license, descriptions, etc etc) can be stored in IPFS.

### VideoStore

The `VideoStore` is a contracts that tracks ownership and prices of videos (be it negative or positive). Buying (i.e. pay-per-view), for example, will register a purchase, and split the money being sent between the `owner` of the video and the [VideoStore.sol](https://github.com/Paratii-Video/paratii-contracts/blob/master/contracts/paratii/VideoStore.sol). To do this, the user must initiate two transactions:

- the client calls `ParatiiToken.approve(ParatiiAvatar.address, price_of_video)` to allows the paratiiAvatar to transfer the price_of_video. (For small transactions, this can be done transparently)
- the client calls `VideoStore.buyVideo(videoId)`, triggering a number of steps:
 - the price of the video will be transfered to the paratiiAvatar
 - an event will be logged that the video is unlocked for this user
 - records the purchase of a video on within the `UserRegistry` allowing the new owner to like/dislike the video
 - a part of the price will be transfered (immediately?) to the owner, other goes tot he redistrubtion pool. (In the first iteration, we can give all money to thee owner)

In addition, Paratii currently uses a simple wrapper contract, [SendEther.sol](https://github.com/Paratii-Video/paratii-contracts/blob/master/contracts/paratii/SendEther.sol), that can be used to send Ether, and will log an event that can be read by clients and logged to transaction history.

The [paratii.js](https://github.com/Paratii-Video/paratii-lib/blob/master/lib/paratii.js) library is the preferred way for clients to interact with the deployed contracts, offering access to them, wallet functionality, and convenience functions that provide more useful error handling than direct calls to the blockchain. 




## library

The Paratii javascript library is the preferred way for clients to interact with the deployed contracts on the blockchain.  It offers access to the contracts, and convenience functions that provide more useful error handling that making direct calls to the blockchain can offer. It also offers wallet functionality.

It is still under development in https://github.com/Paratii-Video/paratii-js

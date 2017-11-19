# Paratii Library documentation


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

### `deployAllContracts()`

  contracts = await paratii.deployAllContracts()

  contracts = await paratii.deployAllContracts({owner: '0x1234435'})

### `contracts`

The `paratii.contracts` attribute of gives access to the different contracts, and returns an array mapping contract names to addresses. For example

  paratii.contracts.ParatiiToken

## ParatiiRegistry

The ParatiiRegistry is a simple key-value store on the blockchain that holds Paratii general settings. In particular, this is the place where the addresses of the deployed Paratii contracts are stored.

For example, the following call will get the address of the `ParatiiToken` contract:

    let paratiiRegistery = paratii.contracts.ParatiiRegistry
    paratiiRegistry.getAddress('ParatiiToken')

The `ParatiiRegistry` is an `Ownable` contract, and contains simple setters and getters for several solidity types:

    ParatiiRegistry.setAddress('UserRegistry', '0x12345') // can only be called by the owner of the contract instance
    ParatiiRegistry.setUint('a-useful-constant', 99999)
    ParatiiRegistry.getUint('a-useful-constant') // will return 99999

## ParatiiToken

The ParatiiToken is an ERC20 token contract and contains the balances of all Paratii account holders.

    paratiToken.balanceOf('0x123') // will return the balance of the given address

## SendEther  

A simple wrapper contract that can be used to send Ether, and will log an event so that the Paratii ecosystem can pick up on it.

## ParatiiAvatar

The `ParatiiAvatar` is a contract that can send and receive ETH and other ERC20 tokens. It is controlled by a number of whitelisted addresses.


    paratiiAvatar = ParatiiAvatar.new()
    erc20Token = 0x12345667
    paratiiAvatar.transferFrom(erc20Token, fromAddress, toAddress, amount) // will fail because you are not whitelisted
    paratiiAvatar.addToWhitelist(0x22222222)
    paratiiAvatar.transferFrom(erc20Token, fromAddress, toAddress, amount, { from: 0x22222222}) // sender is 0x2222, whihc is in the whitelist
    paratiiAvatar.transfer(toAddress, amount) // transfer some ether to toAddress

## UserRegistry

A registry with information about users

## VideoRegistry

A registry with information about videos

## VideoStore

The `VideoStore` is the place to buy Videos. Buying a video in the videostroe will register your purchase, and split the money your are sending between the

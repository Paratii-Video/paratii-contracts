pragma solidity ^0.4.13;

import './ParatiiAvatar.sol';
import './ParatiiToken.sol';
import './VideoRegistry.sol';
import './ContractRegistry.sol';

/**
 * @title VideoStore
 * @dev A Contract that wraps the native transfer function and logs an event.
 */

contract VideoStore is ParatiiToken {

    ContractRegistry contractRegistry;

    event LogBuyVideo(
      bytes32 videoId,
      address buyer,
      uint price
    );

    // TODO: move next accessor function to a libary or class
    function VideoStore(ContractRegistry _contractRegistry) {
      contractRegistry = _contractRegistry;
    }

    function videoRegistry() constant returns(VideoRegistry) {
      return VideoRegistry(contractRegistry.contracts('VideoRegistry'));
    }
    function paratiiToken() constant returns(ParatiiToken) {
      return ParatiiToken(contractRegistry.contracts('ParatiiToken'));
    }
    function paratiiAvatar() constant returns(ParatiiAvatar) {
      return ParatiiAvatar(contractRegistry.contracts('ParatiiAvatar'));
    }
    // If someone accidentally sends ether to this contract, revert;
    function () {
        revert();
    }

    /**
     * @dev buyVideo buys a video
     * user needs to have
     */
    function buyVideo(bytes32 videoId) public returns(bool)  {
       // get the info about the video
       var (owner, price) = videoRegistry().videos(videoId);
       address buyer = msg.sender;
       paratiiToken().transferFrom(buyer, owner, price);
       LogBuyVideo(videoId, msg.sender, price);
       return true;
    }

}

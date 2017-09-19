pragma solidity ^0.4.13;

import './ParatiiAvatar.sol';
import './ParatiiToken.sol';
import './VideoRegistry.sol';
import './VideoContract.sol';

/**
 * @title VideoStore
 * @dev A Contract that wraps the native transfer function and logs an event.
 */

contract VideoStore {

    ContractRegistry contractRegistry;

    event LogBuyVideo(
      bytes32 videoId,
      address buyer,
      uint price
    );

    function VideoStore(ContractRegistry _contractRegistry) {
      contractRegistry = _contractRegistry;
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
       VideoRegistry videoRegistry = VideoRegistry(contractRegistry.contracts('VideoRegistry'));
       ParatiiAvatar paratiiAvatar = ParatiiAvatar(contractRegistry.contracts('ParatiiAvatar'));
       address videoContract_address = videoRegistry.videos(videoId);
       VideoContract videoContract = VideoContract(videoContract_address);
       address buyer = msg.sender;
       uint price = videoContract.get_price(buyer);
       paratiiAvatar.transferFrom(buyer, address(paratiiAvatar), price);
       LogBuyVideo(videoId, msg.sender, price);
       return true;
    }

}

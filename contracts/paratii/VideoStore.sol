pragma solidity ^0.4.13;

import './ParatiiAvatar.sol';
import './ParatiiToken.sol';
import './VideoRegistry.sol';
import './ContractRegistry.sol';
import "../debug/Debug.sol";


/**
 * @title VideoStore
 * @dev A Contract that wraps the native transfer function and logs an event.
 */

contract VideoStore is Ownable, Debug {

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
     */
    function buyVideo(bytes32 videoId) public returns(bool)  {
       // get the info about the video
       /*LogAddress(contractRegistry.contractAddress('VideoRegistry'));*/
       contractRegistry.contractAddress('VideoRegistry');
       VideoRegistry videoRegistry = VideoRegistry(contractRegistry.contractAddress('VideoRegistry'));
       ParatiiAvatar paratiiAvatar = ParatiiAvatar(contractRegistry.contractAddress('ParatiiAvatar'));
       var (owner, price) = videoRegistry.videos(videoId);
       address buyer = msg.sender;
       LogUint(price);
       /*LogUint((price * redistributionPoolPart())/ 10**18);*/
       /*paratiiAvatar.transferFrom(buyer, address(paratiiAvatar), price);*/
       uint paratiiPart = (price * redistributionPoolPart()) / 10 ** 18;
       paratiiAvatar.transferFrom(buyer, address(paratiiAvatar),  paratiiPart);
       paratiiAvatar.transferFrom(buyer, address(owner), price - paratiiPart);
       LogBuyVideo(videoId, msg.sender, price);
       return true;
    }

    function redistributionPoolPart() internal returns(uint) {
        // the "percentage" in precision 10**18
        // i.e. 100% = 10**18
        // TODO: make this settable
        // 30%
        return 30 * 10 ** 16;
    }
}

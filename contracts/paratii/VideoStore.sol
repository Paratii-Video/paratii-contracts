pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './ParatiiAvatar.sol';
import './ParatiiToken.sol';
import './VideoRegistry.sol';
import './ParatiiRegistry.sol';
import "../debug/Debug.sol";


/**
 * @title VideoStore
 * @dev A Contract that wraps the native transfer function and logs an event.
 */

contract VideoStore is Ownable, Debug {

    using SafeMath for uint256;

    ParatiiRegistry public paratiiRegistry;

    event LogBuyVideo(
      string videoId,
      address buyer,
      uint256 price
    );

    function VideoStore(ParatiiRegistry _paratiiRegistry) {
      paratiiRegistry = _paratiiRegistry;
    }

    // If someone accidentally sends ether to this contract, revert;
    function () {
        revert();
    }

    /**
     * @dev buyVideo buys a video
     */
    function buyVideo(string videoId) public returns(bool)  {
       // get the info about the video
       VideoRegistry videoRegistry = VideoRegistry(paratiiRegistry.getContract('VideoRegistry'));
       ParatiiAvatar paratiiAvatar = ParatiiAvatar(paratiiRegistry.getContract('ParatiiAvatar'));
       var (owner, price) = videoRegistry.getVideoInfo(videoId);
       address buyer = msg.sender;
       uint256 paratiiPart = price.mul(redistributionPoolShare()).div(10 ** 18);
       paratiiAvatar.transferFrom(buyer, address(paratiiAvatar),  paratiiPart);
       uint256 ownerPart = price.sub(paratiiPart);
       paratiiAvatar.transferFrom(buyer, owner, ownerPart);
       LogBuyVideo(videoId, buyer, price);
       return true;
    }

    function redistributionPoolShare() internal constant returns(uint256) {
        // the "percentage" in precision 10**18
        return paratiiRegistry.getNumber('VideoRedistributionPoolShare');
    }
}

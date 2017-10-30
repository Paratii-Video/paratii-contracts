pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './ParatiiAvatar.sol';
import './ParatiiToken.sol';
import './VideoRegistry.sol';
import './UserRegistry.sol';
import './ParatiiRegistry.sol';
import "../debug/Debug.sol";


/**
 * @title VideoStore
 * @dev A Contract that wraps the native transfer function and logs an event.
 */

contract VideoStore is Ownable, Debug {

    using SafeMath for uint256;

    ParatiiRegistry public paratiiRegistry;
    UserRegistry public userRegistry;
    VideoRegistry public videoRegistry;
    ParatiiAvatar public paratiiAvatar;

    // Registers sales of video by tracking users that bought it
    // Maps hashes if videoIds to addresses of users that purchased them 
    mapping (bytes32 => address[]) public video_sales;

    event LogBuyVideo(
      string videoId,
      address buyer,
      uint256 price
    );

    function VideoStore(ParatiiRegistry _paratiiRegistry) {
      paratiiRegistry = _paratiiRegistry;
      userRegistry = UserRegistry(paratiiRegistry.getContract("UserRegistry"));
      videoRegistry = VideoRegistry(paratiiRegistry.getContract("VideoRegistry"));
      paratiiAvatar = ParatiiAvatar(paratiiRegistry.getContract('ParatiiAvatar'));
    }

    // If someone accidentally sends ether to this contract, revert;
    function () {
        revert();
    }

    /**
     * @dev buyVideo msg.sender buys a video
     * For the transaction to succeed, the buyer must have approved for the ParatiiAvatar to transfer
     * the sum to the owner and the redistribution pool.
     * [TODO] The fact that the user has bought this video will be registred in the VideoRegistry.
     * A successful transaction logs the LogBuyVideo event
     */
    function buyVideo(string videoId) public returns(bool)  {
       // get the info about the video
       var (owner, price) = videoRegistry.getVideoInfo(videoId);
       address buyer = msg.sender;
       uint256 paratiiPart = price.mul(redistributionPoolShare()).div(10 ** 18);
       paratiiAvatar.transferFrom(buyer, address(paratiiAvatar),  paratiiPart);
       uint256 ownerPart = price.sub(paratiiPart);
       paratiiAvatar.transferFrom(buyer, owner, ownerPart);
       userRegistry.acquireVideo(videoId, buyer);
       video_sales[sha3(videoId)].push(buyer);
       LogBuyVideo(videoId, buyer, price);
       return true;
    }

    function videoPurchased(string videoId, address user) returns(bool) {
        address[] storage users = video_sales[sha3(videoId)];
        for (uint i=0;i<users.length;++i) {
            if (user == users[i]) {
                return true;
            }
        }
        return false;
    }

    function redistributionPoolShare() internal constant returns(uint256) {
        // the "percentage" in precision 10**18
        return paratiiRegistry.getUint('VideoRedistributionPoolShare');
    }
}

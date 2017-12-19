pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './Avatar.sol';
import './ParatiiToken.sol';
import './Videos.sol';
import './Users.sol';
import './Registry.sol';
import "../debug/Debug.sol";


/**
 * @title Store
 * @dev A Contract that wraps the native transfer function and logs an event.
 */

contract Store is Ownable, Debug {

    using SafeMath for uint256;

    Registry public paratiiRegistry;
    Users public userRegistry;
    Videos public videoRegistry;
    Avatar public avatar;

    // Registers sales of video by tracking users that bought it
    // Maps hashes if videoIds to addresses of users that purchased them
    mapping (bytes32 => address[]) public videoSales;

    event LogBuyVideo(
      string videoId,
      address buyer,
      uint256 price
    );

    function Store(Registry _paratiiRegistry) public {
      paratiiRegistry = _paratiiRegistry;
      userRegistry = Users(paratiiRegistry.getContract("Users"));
      videoRegistry = Videos(paratiiRegistry.getContract("Videos"));
      avatar = Avatar(paratiiRegistry.getContract('Avatar'));
    }

    // If someone accidentally sends ether to this contract, revert;
    function () public {
        revert();
    }

    /**
     * @dev buyVideo msg.sender buys a video
     * For the transaction to succeed, the buyer must have approved for the Avatar to transfer
     * the sum to the owner and the redistribution pool.
     * [TODO] The fact that the user has bought this video will be registred in the Videos.
     * A successful transaction logs the LogBuyVideo event
     */
    function buyVideo(string videoId) public returns(bool)  {
       // get the info about the video
       var (owner, price, _ipfsHash, _registrar) = videoRegistry.getVideoInfo(videoId);
       address buyer = msg.sender;
       uint256 paratiiPart = price.mul(redistributionPoolShare()).div(10 ** 18);
       avatar.transferFrom(buyer, address(avatar),  paratiiPart);
       uint256 ownerPart = price.sub(paratiiPart);
       avatar.transferFrom(buyer, owner, ownerPart);
       userRegistry.acquireVideo(videoId, buyer);
       videoSales[keccak256(videoId)].push(buyer);
       LogBuyVideo(videoId, buyer, price);
       return true;
    }

    function redistributionPoolShare() internal constant returns(uint256) {
        // the "percentage" in precision 10**18
        return paratiiRegistry.getUint('VideoRedistributionPoolShare');
    }
}

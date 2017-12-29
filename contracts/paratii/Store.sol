pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './Avatar.sol';
import './ParatiiToken.sol';
import './Registry.sol';
import './Sales.sol';
import './Users.sol';
import './Videos.sol';
import '../debug/Debug.sol';


/**
 * @title Store
 * @dev A Contract that wraps the native transfer function and logs an event.
 */

contract Store is Ownable, Debug {

    using SafeMath for uint256;

    Sales public sales;
    Avatar public avatar;
    Registry public registry;
    Users public userRegistry;
    Videos public videoRegistry;

    event LogBuyVideo(string _videoId, address _buyer, uint _price);

    function Store(Registry _registry) public {
      registry = _registry;
      avatar = Avatar(registry.getContract('Avatar'));
      userRegistry = Users(registry.getContract("Users"));
      videoRegistry = Videos(registry.getContract("Videos"));
    }

    // If someone accidentally sends ether to this contract, revert;
    function () public {
        revert();
    }

    /**
     * @dev buyVideo msg.sender buys a video
     * @param videoId the id of the video
     * For the transaction to succeed, the buyer must have approved for the Avatar to transfer
     * the sum to the owner and the redistribution pool.
     */
    function buyVideo(string videoId) public returns(bool)  {
       // get the info about the video
       Videos videoRegistry = Videos(registry.getContract("Videos"));
       var (owner, price, _ipfsHash, _ipfsData, _registrar) = videoRegistry.getVideoInfo(videoId);
       address buyer = msg.sender;
       uint256 paratiiPart = price.mul(redistributionPoolShare()).div(10 ** 18);
       avatar.transferFrom(buyer, address(avatar),  paratiiPart);
       uint256 ownerPart = price.sub(paratiiPart);
       avatar.transferFrom(buyer, owner, ownerPart);
       Sales sales = Sales(registry.getContract('Sales'));
       sales.registerSale(videoId, buyer, price);
       LogBuyVideo(videoId, buyer, price);
       return true;
    }

    function redistributionPoolShare() internal constant returns(uint256) {
        // the "percentage" in precision 10**18
        return registry.getUint('VideoRedistributionPoolShare');
    }
}

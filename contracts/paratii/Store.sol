pragma solidity ^0.4.23;

import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
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
    Registry public registry;

    event LogBuyVideo(string _videoId, address _buyer, uint _price);

    constructor(Registry _registry) public {
        registry = _registry;
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
    function buyVideo(string videoId, string ipfsData) public returns(bool)  {
        // get the info about the video
        Avatar avatar = Avatar(registry.getContract("Avatar"));
        /*Videos videos = Videos(registry.getContract('Videos'));*/
        address owner;
        uint256 price;
        (owner, price, , , ,) = Videos(registry.getContract("Videos")).get(videoId);
        uint256 paratiiPart = price.mul(redistributionPoolShare()).div(10 ** 18);
        avatar.transferFrom(msg.sender, address(avatar), paratiiPart);
        uint256 ownerPart = price.sub(paratiiPart);
        avatar.transferFrom(msg.sender, owner, ownerPart);
        Sales(registry.getContract("Sales")).create(msg.sender, videoId, price, ipfsData);
        emit LogBuyVideo(videoId, msg.sender, price);
        return true;
    }

    function redistributionPoolShare() internal view returns(uint256) {
        // the "percentage" in precision 10**18
        return registry.getUint("VideoRedistributionPoolShare");
    }
}

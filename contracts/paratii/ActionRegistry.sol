pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './ParatiiAvatar.sol';
import './ParatiiToken.sol';
import './ParatiiRegistry.sol';
import "../debug/Debug.sol";


/**
 * @title ActionRegistry
 * @dev A Contract that wraps the native transfer function and logs an event.
 */

contract ActionRegistry is Ownable, Debug {

    using SafeMath for uint256;

    ParatiiRegistry public paratiiRegistry;

    event LogAction (
      string videoId,
      address user,
      uint256 action,
      string tag
    );

    function ActionRegistry(ParatiiRegistry _paratiiRegistry) {
      paratiiRegistry = _paratiiRegistry;
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
    function Act(string videoId,
                 string action_contract,
                 string transfer_contract) public returns(bool) {

       address buyer = msg.sender;

       // get the info about the video
       VideoRegistry videoRegistry = VideoRegistry(paratiiRegistry.getContract('VideoRegistry'));
       var (owner, price) = videoRegistry.getVideoInfo(videoId);

       TransferContract transferContract = TransferContract(paratiiRegistry.getContract(transfer_contract));

       ActionContract actionContract = ActionContract(paratiiRegistry.getContract(action_contract));

       // collect redistribution funds
       uint256 paratiiPart = price.mul(redistributionPoolShare()).div(10 ** 18);
       ParatiiAvatar paratiiAvatar = ParatiiAvatar(paratiiRegistry.getContract('ParatiiAvatar'));
       paratiiAvatar.transferFrom(buyer, address(paratiiAvatar),  paratiiPart);

       uint256 ownerPart = price.sub(paratiiPart);

       transferContract.transferFrom(buyer, owner, ownerPart);
       // paratiiAvatar.transferFrom(buyer, owner, ownerPart);
       LogAction(videoId, buyer, price, 'buyVido');
       return true;
    }

    function redistributionPoolShare() internal constant returns(uint256) {
        // the "percentage" in precision 10**18
        return paratiiRegistry.getUint('VideoRedistributionPoolShare');
    }
}

contract TransferContract {

}

contract ActionContract {
 
}

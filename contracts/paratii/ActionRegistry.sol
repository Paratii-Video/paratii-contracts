pragma solidity ^0.4.13;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './ParatiiAvatar.sol';
import './VideoRegistry.sol';
import './ParatiiRegistry.sol';
import "../debug/Debug.sol";


/**
 * @title ActionRegistry
 * @dev A Contract that wraps the native transfer function and logs an event.
 */

contract ActionRegistry is Ownable, Debug {

    using SafeMath for uint256;

    ParatiiRegistry public paratiiRegistry;
    ParatiiAvatar public paratiiAvatar;
    VideoRegistry public videoRegistry;
    string public tag; // tag for this action

    struct Receipt {
        address recipient;
        uint256 amount;
    }

    event LogAction (
      string videoId, // the video this action applied to
      address user, // the user who did this action
      string tag, // tag used to encode class of action; e.g. "Like", "Tag", "BuyVideo", etc
      string action // used to encode specifics of action, e.g. "Dislike", "Cats", "156 PTI", etc
    );

    function ActionRegistry(ParatiiRegistry _paratiiRegistry,
                            string _tag) {
      paratiiRegistry = _paratiiRegistry;
      videoRegistry = VideoRegistry(paratiiRegistry.getContract('VideoRegistry'));
      paratiiAvatar = ParatiiAvatar(paratiiRegistry.getContract('ParatiiAvatar'));
      tag = _tag;
    }

    // If someone accidentally sends ether to this contract, revert;
    function () {
        revert();
    }

    /**
     * @dev Transfer funds to avatar and recipients, and log action
     * For the transaction to succeed, the buyer must have approved for the ParatiiAvatar to transfer
     * the sum to the owner and the redistribution pool.
     */
    function transferFunds(string videoId, string action) public {
        address actor = msg.sender;
        Receipt[] memory receipts = getReceipts(actor, videoId, action);
        uint256 amount;
        uint256 paratiiPart;
        uint256 paratiiFraction = redistributionPoolShare().div(10 ** 18);
        uint256 paratiiTotal = 0;
        address recipient;
        Receipt memory receipt;
        for (uint i=0; i < receipts.length; ++i) {
            receipt = receipts[i];
            amount = receipt.amount;
            paratiiPart = amount.mul(paratiiFraction);
            paratiiTotal += paratiiPart;
            amount -= paratiiPart;
            paratiiAvatar.transferFrom(actor, recipient, amount);
        }
        paratiiAvatar.transferFrom(actor, address(paratiiAvatar), paratiiTotal);
        LogAction(videoId, actor, action, tag);
    } 

    /**
     * @dev getReceipts returns a series of recipients and the amounts they should receive
     * to be overridden by specific subcontracts
     */
    function getReceipts(address actor, string videoId, string action) internal returns (Receipt[]) {

        videoRegistry = VideoRegistry(paratiiRegistry.getContract('VideoRegistry'));
        var (owner, price) = videoRegistry.getVideoInfo(videoId);

        Receipt receipt;
        receipt.recipient = owner;
        receipt.amount = price;

        Receipt[] memory receipts;
        receipts[1] = receipt;
        return receipts;
    }

    function redistributionPoolShare() internal constant returns(uint256) {
        // the "percentage" in precision 10**18
        return paratiiRegistry.getUint('VideoRedistributionPoolShare');
    }

    /**
     * @dev Potentially useful method for converting strings to uints
     * shamelessly stolen from https://ethereum.stackexchange.com/questions/10932/how-to-convert-string-to-int
     * [TODO] check input for sanity
     */
    function stringToUint(string s) constant returns (uint result) {
        bytes memory b = bytes(s);
        uint i;
        result = 0;
        for (i = 0; i < b.length; i++) {
            uint c = uint(b[i]);
            if (c >= 48 && c <= 57) {
                result = result * 10 + (c - 48);
            }
        }
    }
}

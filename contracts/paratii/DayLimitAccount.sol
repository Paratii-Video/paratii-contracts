pragma solidity ^0.4.4;

import "zeppelin-solidity/contracts/token/ERC20.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";

/* This contract manages an account of an ERC20 Token
 * it lock the tokens, and and releases not more than a given amount of tokens each day
 * to a gven beneficary
 */

contract DayLimitAccount {
    ERC20 public token;
    uint public limit; // amount of tokens to release each day
    uint public firstDay; // first day that tokens were released
    uint public claimed; // amount of tokens that were already claimed
    address public beneficary; // who gets the released tokens

    function DayLimitAccount(ERC20 _token, address _beneficary, uint _limit) {
        token = _token;
        beneficary = _beneficary;
        firstDay = today() - 1;
        limit = _limit;
    }

    // determines today's index.
    function today() private constant returns (uint) {
      return now / 1 days;
    }

    // returns how much tokens are claimable
    function claimable() constant returns (uint) {
        uint total_claimable = SafeMath.mul(today() - firstDay, limit);
        return (total_claimable - claimed);
    }

    // transfer all claimable tokens to the beneficary
    function claim() {
        uint _value = claimable();
        claimed += _value;
        if (!(token.transfer(beneficary, _value))) {
            revert();
        }
    }
}

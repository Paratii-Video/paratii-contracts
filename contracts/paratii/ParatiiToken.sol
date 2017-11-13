pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/StandardToken.sol";

contract ParatiiToken is StandardToken {

    string public name = "Paratii";
    string public symbol = "PTI";
    uint public decimals = 18;
    uint public INITIAL_SUPPLY = 21000000 * (10**decimals);

    function ParatiiToken() {
        totalSupply = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }
}

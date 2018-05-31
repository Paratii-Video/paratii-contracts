pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

contract ParatiiToken is StandardToken {

    string public name = "Paratii";
    string public symbol = "PTI";
    uint public decimals = 18;
    uint public INITIAL_SUPPLY = 21000000 * (10**decimals);

    constructor() public {
        totalSupply_ = INITIAL_SUPPLY;
        balances[msg.sender] = INITIAL_SUPPLY;
    }
}

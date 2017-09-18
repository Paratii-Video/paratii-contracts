pragma solidity ^0.4.13;
import './ContractRegistry.sol';
import './ParatiiToken.sol';

/*
 * @dev A contract that holds PTI for the paratii DAO
 *
 */

contract ParatiiAvatar {
    ContractRegistry contractRegistry;
    
    function ParatiiAvatar(ContractRegistry _contractRegistry) {
        contractRegistry = _contractRegistry;
    }

    function transferFrom(address _from, address _to, uint256 _value) returns (bool) {
        ParatiiToken token = ParatiiToken(contractRegistry.contracts('ParatiiToken'));
        return token.transferFrom(_from, _to, _value);
    }
}

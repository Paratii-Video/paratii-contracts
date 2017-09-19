pragma solidity ^0.4.13;
import './ContractRegistry.sol';
/*import './ParatiiToken.sol';*/
/*import './VideoRegistry.sol';*/

/*
 * @dev A contract that holds PTI for the paratii DAO
 *
 */

contract ParatiiContract {
    ContractRegistry contractRegistry;

    function ParatiiContract(ContractRegistry _contractRegistry) {
        contractRegistry = _contractRegistry;
    }

    /*function videoRegistry() constant returns(VideoRegistry) {
      return VideoRegistry(contractRegistry.contracts('VideoRegistry'));
    }*/
    /*function paratiiToken() constant returns(ParatiiToken) {
      return ParatiiToken(contractRegistry.contracts('ParatiiToken'));
    }*/
    /*function paratiiAvatar() constant returns(ParatiiAvatar) {
      return ParatiiAvatar(contractRegistry.contracts('ParatiiAvatar'));
    }*/
}

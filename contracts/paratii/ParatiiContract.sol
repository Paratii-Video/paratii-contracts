pragma solidity ^0.4.13;
import './ParatiiRegistry.sol';
/*import './ParatiiToken.sol';*/
/*import './VideoRegistry.sol';*/

/*
 * @dev A contract that holds PTI for the paratii DAO
 *
 */

contract ParatiiContract {
    ParatiiRegistry paratiiRegistry;

    function ParatiiContract(ParatiiRegistry _paratiiRegistry) {
        paratiiRegistry = _paratiiRegistry;
    }

    /*function videoRegistry() constant returns(VideoRegistry) {
      return VideoRegistry(ParatiiRegistry.contracts('VideoRegistry'));
    }*/
    /*function paratiiToken() constant returns(ParatiiToken) {
      return ParatiiToken(ParatiiRegistry.contracts('ParatiiToken'));
    }*/
    /*function paratiiAvatar() constant returns(ParatiiAvatar) {
      return ParatiiAvatar(ParatiiRegistry.contracts('ParatiiAvatar'));
    }*/
}

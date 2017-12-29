pragma solidity ^0.4.18;
import './Registry.sol';
import './ParatiiToken.sol';
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
/*
 * @dev A contract that holds PTI for the paratii DAO
 *
 */

contract Avatar is Ownable {
    Registry public registry;

    address[] public whitelist;

    modifier onlyWhitelist() {
        require(isOnWhiteList(msg.sender));
        _;
    }

    function Avatar(Registry _registry) {
        registry = _registry;
        owner = msg.sender;
    }

    function addToWhitelist(address _address) onlyOwner {
      // check if the address is already known, and if there is a free space in the whitelist
      uint freeSpace = whitelist.length;
      for (uint i=0; i < whitelist.length; i++) {
          if (whitelist[i] == _address) {
            return;
          }
          if (whitelist[i] == address(0)) {
            freeSpace = i;
          }
      }
      if (freeSpace == whitelist.length){
          whitelist.push(_address);
      } else {
          whitelist[freeSpace] = _address;
      }
    }

    function removeFromWhitelist(address _address) onlyOwner {
      for (uint i=0; i < whitelist.length; i++) {
          if (whitelist[i] == _address) {
              delete whitelist[i];
          }
      }
    }

    function isOnWhiteList(address _address) public constant returns(bool) {
      for (uint i=0; i < whitelist.length; i++) {
          if (whitelist[i] == _address) {
              return true;
          }
      }
      return false;
    }

    function transferFrom(address _from, address _to, uint256 _value) onlyWhitelist returns (bool)   {
        ParatiiToken token = ParatiiToken(registry.getContract('ParatiiToken'));
        return token.transferFrom(_from, _to, _value);
    }
}

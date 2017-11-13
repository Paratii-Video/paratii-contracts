pragma solidity ^0.4.15;
import './ParatiiRegistry.sol';
import './ParatiiToken.sol';
import "zeppelin-solidity/contracts/ownership/Ownable.sol";
/*
 * @dev A contract that holds PTI for the paratii DAO
 *
 */

contract ParatiiAvatar is Ownable {
    ParatiiRegistry public paratiiRegistry;

    address[] public whitelist;

    modifier onlyWhitelist() {
        require(isOnWhiteList(msg.sender));
        _;
    }

    function ParatiiAvatar(ParatiiRegistry _paratiiRegistry) {
        paratiiRegistry = _paratiiRegistry;
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
        ParatiiToken token = ParatiiToken(paratiiRegistry.getContract('ParatiiToken'));
        return token.transferFrom(_from, _to, _value);
    }
}

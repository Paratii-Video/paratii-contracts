pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract ContractRegistry is Ownable {

  mapping (bytes32=>address) public contracts;

  event LogRegisterContract(bytes32 _name, address _address);
  event LogUnregisterContract(bytes32 _name);

  function ContractRegistry() {
      owner = msg.sender;
  }

  function register(bytes32 _name, address _address) public {
    contracts[_name] = _address;
    LogRegisterContract(_name, _address);
  }

  function unregister(bytes32 _name) public {
    delete contracts[_name];
    LogUnregisterContract(_name);
  }

  function contractAddress(bytes32 _name) public constant returns(address) {
    return contracts[_name];
  }
}

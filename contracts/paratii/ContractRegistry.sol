pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract ContractRegistry is Ownable  {

  mapping (bytes32=>address) public contracts;

  event LogRegisterContract(string _name, address _address);
  event LogUnregisterContract(string _name);

  function ContractRegistry() {
      owner = msg.sender;
  }

  function register(string _name, address _address) public onlyOwner {
    contracts[sha3(_name)] = _address;
    LogRegisterContract(_name, _address);
  }

  function unregister(string _name) public onlyOwner {
    delete contracts[sha3(_name)];
    LogUnregisterContract(_name);
  }

  function contractAddress(string _name) public constant returns(address) {
    return contracts[sha3(_name)];
  }
}

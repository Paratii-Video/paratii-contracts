pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @dev the ParatiiRegistry contains settings and addresses of contracts for the Partii Ecosystem
 *
 **/
contract ParatiiRegistry is Ownable  {

  mapping (bytes32=>address) public contracts;

  event LogRegisterContract(string _name, address _address);
  event LogUnregisterContract(string _name);

  function ParatiiRegistry() {
      owner = msg.sender;
  }

  function registerContract(string _name, address _address) public onlyOwner {
    contracts[sha3(_name)] = _address;
    LogRegisterContract(_name, _address);
  }

  function unregisterContract(string _name) public onlyOwner {
    delete contracts[sha3(_name)];
    LogUnregisterContract(_name);
  }

  function getAddress(string _name) public constant returns(address) {
    return contracts[sha3(_name)];
  }
}

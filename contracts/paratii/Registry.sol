pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

/**
 * @dev the Registry contains settings and addresses of contracts for the Partii Ecosystem
 *
 **/
contract Registry is Ownable  {

  mapping (bytes32=>address) public contracts;
  mapping (bytes32=>uint) public numbers;
  mapping (bytes32=>string) public strings;

  event LogRegisterAddress(string _name, address _address);
  event LogUnregisterAddress(string _name);
  event LogRegisterUint(string _name, uint _number);
  event LogUnregisterUint(string _name);
  event LogRegisterString(string _name, string _string);
  event LogUnregisterString(string _name);

  function Registry() public {
      owner = msg.sender;
  }

  function registerAddress(string _name, address _address) public onlyOwner {
    contracts[keccak256(_name)] = _address;
    LogRegisterAddress(_name, _address);
  }

  function unregisterAddress(string _name) public onlyOwner {
    delete contracts[keccak256(_name)];
    LogUnregisterAddress(_name);
  }

  function getContract(string _name) public constant returns(address) {
    return contracts[keccak256(_name)];
  }

  function registerUint(string _name, uint _number) public onlyOwner {
    numbers[keccak256(_name)] = _number;
    LogRegisterUint(_name, _number);
  }

  function unregisterUint(string _name) public onlyOwner {
    delete numbers[keccak256(_name)];
    LogUnregisterUint(_name);
  }

  function getUint(string _name) public constant returns(uint) {
    return numbers[keccak256(_name)];
  }

  function registerString(string _name, string _string) public onlyOwner {
    strings[keccak256(_name)] = _string;
    LogRegisterString(_name, _string);
  }

  function unregisterString(string _name) public onlyOwner {
    delete strings[keccak256(_name)];
    LogUnregisterString(_name);
  }

  function getString(string _name) public constant returns(string) {
    return strings[keccak256(_name)];
  }
}

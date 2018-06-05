pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import './ParatiiToken.sol';
import './Registry.sol';

contract PTIDistributor is Ownable {

    Registry public registry;

    event LogDistribute(address _toAddress, uint _amount, string _reason);
    event LogDistributeTransferable(address _toAddress, uint _amount, string _reason);
    event LogDebug(bytes32 _hashing);
    event LogDebugOwner(address _owner);

    mapping(bytes32 => bool) public isUsed;

    constructor(Registry _registry) public {
      owner = msg.sender;
      registry = _registry;
    }


    function distribute(address _toAddress, uint256 _amount, bytes32 _salt, string _reason, uint8 _v, bytes32 _r, bytes32 _s) public {
      bytes32 message = keccak256(_toAddress, _amount, _salt, _reason);
      bytes memory prefix = "\x19Ethereum Signed Message:\n32";
      bytes32 prefixedHash = keccak256(prefix, message);
      require(!isUsed[_salt] && ecrecover(prefixedHash, _v, _r, _s) == owner);
      isUsed[_salt] = true;
      ParatiiToken token = ParatiiToken(registry.getContract("ParatiiToken"));
      require(token.transfer(_toAddress, _amount));
      emit LogDistribute(_toAddress, _amount, _reason);
    }

    function checkOwnerPacked(address _toAddress, uint256 _amount, bytes32 _salt, string _reason, uint8 _v, bytes32 _r, bytes32 _s) public {
      bytes32 message = keccak256(_toAddress, _amount, _salt, _reason);
      bytes memory prefix = "\x19Ethereum Signed Message:\n32";
      bytes32 prefixedHash = keccak256(prefix, message);
      emit LogDebugOwner( ecrecover(prefixedHash, _v, _r, _s) );
    }
    function checkOwner(bytes32 _hash, uint8 _v, bytes32 _r, bytes32 _s) pure public returns (address) {
      bytes memory prefix = "\x19Ethereum Signed Message:\n32";
      bytes32 prefixedHash = keccak256(prefix, _hash);
      return ecrecover(prefixedHash, _v, _r, _s);
    }

    function checkHashing(address _toAddress, uint256 _amount, bytes32 _salt, string _reason) public {
      bytes32 hashing = keccak256(_toAddress, _amount, _salt, _reason);
      emit LogDebug( hashing );
    }
}

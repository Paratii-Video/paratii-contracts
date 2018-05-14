pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import './ParatiiToken.sol';
import './Registry.sol';

contract PTIDistributor is Ownable {

    Registry public registry;

    event LogDistribute(address _toAddress, uint _amount);
    mapping(bytes32 => bool) public isUsed;

    function PTIDistributor(Registry _registry) public {
        owner = msg.sender;
        registry = _registry;
    }

    function() public payable { }

    function distribute(address _toAddress, uint256 _amount, bytes32 _signedNonce, uint8 _v, bytes32 _r, bytes32 _s) {

      if(ecrecover(_signedNonce, _v, _r, _s) == owner && !isUsed[_signedNonce]) {
        isUsed[_signedNonce] = true;
        ParatiiToken token = ParatiiToken(registry.getContract('ParatiiToken'));
        token.transfer(msg.sender, _amount);
        LogDistribute(_toAddress, _amount);
      }
    }
}

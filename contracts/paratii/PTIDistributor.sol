pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import './ParatiiToken.sol';
import './Registry.sol';

contract PTIDistributor is Ownable {

    Registry public registry;

    event LogDistribute(bytes32 _hashedVoucher, uint _amount);

    function PTIDistributor(Registry _registry) public {
        owner = msg.sender;
        registry = _registry;
    }

    modifier onlyOwnerOrAvatar() {
        require((msg.sender == owner) || (msg.sender == registry.getContract('Avatar')));
        _;
    }

    function() public payable { }

    function distribute(address _toAddress, uint _amount, string _reason) public onlyOwnerOrAvatar returns(bool) {
        //reason: reason of the distribute,
        ParatiiToken token = ParatiiToken(registry.getContract('ParatiiToken'));
        token.transfer(msg.sender, voucher._amount);
        LogDistribute(_toAddress, _amount, _reason);
    }
}

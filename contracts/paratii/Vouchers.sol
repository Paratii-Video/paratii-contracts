pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import './ParatiiToken.sol';
import './Registry.sol';

contract Vouchers is Ownable {

    Registry public registry;

    struct Data {
        address _claimant;
        uint _amount;
    }

    mapping (bytes32 => Data) public vouchers;

    event LogCreateVoucher(bytes32 _hashedVoucher, uint _amount);
    event LogRemoveVoucher(bytes32 _hashedVoucher);
    event LogRedeemVoucher(bytes32 _hashedVoucher, string _voucher, uint _amount, address _claimant);

    modifier onlyOwnerOrAvatar() {
        require((msg.sender == owner) || (msg.sender == registry.getContract("Avatar")));
        _;
    }

    constructor(Registry _registry) public {
        owner = msg.sender;
        registry = _registry;
    }

    // make this contract payable
    function() public payable { }

    function create(bytes32 _hashedVoucher, uint _amount) public onlyOwnerOrAvatar {
        require(_amount > 0);
        vouchers[_hashedVoucher] = Data(address(0), _amount);
        emit LogCreateVoucher(_hashedVoucher, _amount);
    }

    function remove(bytes32 _hashedVoucher) public onlyOwnerOrAvatar {
        delete vouchers[_hashedVoucher];
        emit LogRemoveVoucher(_hashedVoucher);
    }

    /* A convenience function that hashes teh voucher, to be call'ed locally */
    function hashVoucher(string _voucher) public pure returns(bytes32 _hashedVoucher) {
        return keccak256(_voucher);
    }

    /*
     * redeem the Voucher
     * NOTE: This _is_ vulnerable to front-running attacks (the attacker can intercept the transaction,
       extract the voucher, and redeem it himself)
     */
    function redeem(string _voucher) public returns(bool) {
        // the voucher must exist and not have been redeemed (yet)
        bytes32 hashedVoucher = hashVoucher(_voucher);
        Data storage voucher = vouchers[hashedVoucher];
        require(voucher._amount > 0);
        require(voucher._claimant == address(0));
        // invalidate the voucher, and send the money to the sender
        vouchers[hashedVoucher]._claimant = msg.sender;
        // get the pti token contract from the registry
        ParatiiToken token = ParatiiToken(registry.getContract("ParatiiToken"));
        token.transfer(msg.sender, voucher._amount);
        emit LogRedeemVoucher(hashedVoucher, _voucher, voucher._amount, msg.sender);
    }
}

pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract VideoContract is Ownable {
    uint public default_price;

    function VideoContract(uint _default_price) {
        owner = msg.sender;
        default_price = _default_price;
    }

    function set_default_price(uint new_default_price) onlyOwner {
        default_price = new_default_price;
    }

    function get_price(address) public returns (uint) {
        return default_price;
    }
}

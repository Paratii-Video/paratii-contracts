pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './Registry.sol';

contract Sales is Ownable {

    Registry public registry;

    // mapping from user addrsses and video ids to booleans
    mapping (address=> mapping (bytes32 => bool)) private _sales;

    event LogRegisterSale(string _videoId, address _buyer, uint _price);

    modifier onlyOwnerOrAvatar() {
        require((msg.sender == owner) || (msg.sender == registry.getContract('Avatar')));
        _;
    }

    modifier onlyOwnerOrStore() {
        require((msg.sender == owner) || (msg.sender == registry.getContract('Store')));
        _;
    }

    function Sales(Registry _registry) public {
        owner = msg.sender;
        registry = _registry;
    }

   /**
    * @dev registers a sale of a video
    * Does not do any payments - this call only registers the sale
    * @param _videoId the id of the video
    * @param _buyer the buyer of the video (an ethereum address)
    * @param _price the price that was paid for the video
    */
   function registerSale(string _videoId, address _buyer, uint _price) public onlyOwnerOrStore {
      _sales[_buyer][keccak256(_videoId)] = true;
       LogRegisterSale(_videoId, _buyer, _price);
    }

    function userBoughtVideo(string _videoId, address _address) public constant returns(bool) {
      return _sales[_address][keccak256(_videoId)];
    }
}

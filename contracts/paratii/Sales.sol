pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './Registry.sol';

contract Sales is Ownable {

    Registry public registry;

    struct Data {
      bool _isRegistered;
      uint _price;
      string _ipfsData;
    }


    // mapping from user addrsses and video ids to booleans
    mapping (address=> mapping (bytes32 => Data)) private _sales;

    event LogRegisterSale(string _videoId, address _buyer, uint _price, string _ipfsData);

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
    * @param _ipfsData a reference to further data that can be found on ipfs
    */
    function create(string _videoId, address _buyer, uint _price, string _ipfsData)
      public onlyOwnerOrStore {
      _sales[_buyer][keccak256(_videoId)] = Data(true, _price, _ipfsData);
       LogRegisterSale(_videoId, _buyer, _price, _ipfsData);
    }

    function deleteSale(string _videoId, address _buyer) public {
      delete _sales[_buyer][keccak256(_videoId)];
    }

    function get(string _videoId, address _buyer) public  constant returns(Data) {
      return _sales[_buyer][keccak256(_videoId)];
    }

    function userBoughtVideo(string _videoId, address _buyer) public constant returns(bool) {
      return _sales[_buyer][keccak256(_videoId)]._isRegistered;
    }
}

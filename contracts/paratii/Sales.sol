pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
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

    event LogCreateSale(address _buyer, string _videoId, uint _price, string _ipfsData);
    event LogRemoveSale(address _buyer, string _videoId);

    modifier onlyOwnerOrStore() {
        require((msg.sender == owner) || (msg.sender == registry.getContract("Store")));
        _;
    }

    constructor(Registry _registry) public {
        owner = msg.sender;
        registry = _registry;
    }

   /**
    * @dev registers a sale of a video
    * Does not do any payments - this call only registers the sale
    * Only the Store contract (as well as the owner) can register a sale
    * @param _videoId the id of the video
    * @param _buyer the buyer of the video (an ethereum address)
    * @param _price the price that was paid for the video
    * @param _ipfsData a reference to further data that can be found on ipfs
    */
    function create(address _buyer, string _videoId, uint _price, string _ipfsData)
        public onlyOwnerOrStore {
        _sales[_buyer][keccak256(_videoId)] = Data(true, _price, _ipfsData);
        emit LogCreateSale(_buyer, _videoId, _price, _ipfsData);
    }

    /**
     * @dev Remove the sale from the registry
     * Only the Store contract or the owner can remove a sale
     */
    function remove(address _buyer, string _videoId)
        public onlyOwnerOrStore {
        delete _sales[_buyer][keccak256(_videoId)];
        emit LogRemoveSale(_buyer, _videoId);
    }

    /**
     * @dev Get information about the sale from the registry
     * Only the Store contract or the owner can remove a sale
     * @return price and ipfsData
     */
    function get(address _buyer, string _videoId) public view returns(uint, string) {
        Data storage _data = _sales[_buyer][keccak256(_videoId)];
        return (
            _data._price,
            _data._ipfsData
        );
    }

    function userBoughtVideo(address _buyer, string _videoId) public view returns(bool) {
        return _sales[_buyer][keccak256(_videoId)]._isRegistered;
    }
}

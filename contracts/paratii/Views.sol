pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import './Registry.sol';

contract Views is Ownable {

    Registry public registry;

    struct Data {
        bool _isRegistered;
        string _ipfsData;
    }

    // mapping from user addrsses and video ids to booleans
    mapping (address=> mapping (bytes32 => Data)) private _views;

    event LogCreateView(address _address, string _videoId, string _ipfsData);
    event LogRemoveView(address _address, string _videoId);

    modifier onlyOwnerOrAvatar() {
        require((msg.sender == owner) || (msg.sender == registry.getContract("Avatar")));
        _;
    }

    constructor(Registry _registry) public {
        owner = msg.sender;
        registry = _registry;
    }

    function create(address _viewer, string _videoId, string _ipfsData) public onlyOwnerOrAvatar {
        _views[_viewer][keccak256(_videoId)] = Data(true, _ipfsData);
        emit LogCreateView(_viewer, _videoId, _ipfsData);
    }

    function remove(address _viewer, string _videoId) public onlyOwnerOrAvatar {
        delete _views[_viewer][keccak256(_videoId)];
        emit LogRemoveView(_viewer, _videoId);
    }

    function get(address _viewer, string _videoId) public view onlyOwnerOrAvatar returns(bool, string) {
        Data storage data = _views[_viewer][keccak256(_videoId)];
        return (data._isRegistered, data._ipfsData);
    }

    function userViewedVideo(address _viewer, string _videoId) public view returns(bool) {
        return _views[_viewer][keccak256(_videoId)]._isRegistered;
    }
}

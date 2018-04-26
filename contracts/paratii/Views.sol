pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
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
        require((msg.sender == owner) || (msg.sender == registry.getContract('Avatar')));
        _;
    }

    function Views(Registry _registry) public {
        owner = msg.sender;
        registry = _registry;
    }

    function create(address _viewer, string _videoId, string _ipfsData) public onlyOwnerOrAvatar {
       _views[_viewer][keccak256(_videoId)] = Data(true, _ipfsData);
       LogCreateView(_viewer, _videoId, _ipfsData);
    }

    function remove(address _viewer, string _videoId) public onlyOwnerOrAvatar {
       delete _views[_viewer][keccak256(_videoId)];
       LogRemoveView(_viewer, _videoId);
    }
    //  disabling returning a struct , ref: https://ethereum.stackexchange.com/a/43054
    /* function get(address _viewer, string _videoId) public constant onlyOwnerOrAvatar returns(Data) {
       return _views[_viewer][keccak256(_videoId)];
    } */

    function get(address _viewer, string _videoId) public constant onlyOwnerOrAvatar returns (bool, string) {
      Data storage d = _views[_viewer][keccak256(_videoId)];
      return (d._isRegistered, d._ipfsData);
    }
    function userViewedVideo(address _viewer, string _videoId) public constant returns(bool) {
      return _views[_viewer][keccak256(_videoId)]._isRegistered;
    }
}

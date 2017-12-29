pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import './Registry.sol';

contract Views is Ownable {

    Registry public registry;

    // mapping from user addrsses and video ids to booleans
    mapping (address=> mapping (bytes32 => bool)) private _views;

    event LogView(address _address, string _videoId);

    modifier onlyOwnerOrAvatar() {
        require((msg.sender == owner) || (msg.sender == registry.getContract('Avatar')));
        _;
    }

    function Views(Registry _registry) public {
        owner = msg.sender;
        registry = _registry;
    }

    function addView(string _videoId, address _viewer) public onlyOwnerOrAvatar {
       _views[_viewer][keccak256(_videoId)] = true;
       LogView(_viewer, _videoId);
    }

    function userViewedVideo(address _address, string _videoId) public constant returns(bool) {
      return _views[_address][keccak256(_videoId)];
    }
}

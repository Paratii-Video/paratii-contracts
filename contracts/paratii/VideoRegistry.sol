pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract VideoRegistry is Ownable {

    struct VideoInfo {
      address owner;
      uint256 price; // price in PTI-wei
    }

    mapping (bytes32=>VideoInfo) public videos;

    event LogRegisterVideo(bytes32 hash, address owner);
    event LogUnregisterVideo(bytes32 hash);

    function VideoRegistry() {
        owner = msg.sender;
    }

    function registerVideo(bytes32 _hash, address _owner, uint256 _price) {
      videos[_hash] =  VideoInfo({
          owner: _owner,
          price: _price
      });

      LogRegisterVideo(_hash, _owner);
    }

    function unregisterVideo(bytes32 _hash) onlyOwner {
        delete videos[_hash];
        LogUnregisterVideo(_hash);
    }
}

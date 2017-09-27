pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract VideoRegistry is Ownable {

    struct VideoInfo {
      address owner;
      uint256 price; // price in PTI-wei
    }

    mapping (bytes32=>VideoInfo) public videos;

    event LogRegisterVideo(string videoId, address owner);
    event LogUnregisterVideo(string videoId);

    function VideoRegistry() {
        owner = msg.sender;
    }

    function registerVideo(string _videoId, address _owner, uint256 _price) {
      videos[sha3(_videoId)] =  VideoInfo({
          owner: _owner,
          price: _price
      });

      LogRegisterVideo(_videoId, _owner);
    }

    function unregisterVideo(string _videoId) public onlyOwner {
        delete videos[sha3(_videoId)];
        LogUnregisterVideo(_videoId);
    }

    function unregisterVideo2(string _videoId) {
      LogRegisterVideo(_videoId, owner);
    }


    function getVideoInfo(string _videoId) constant returns(address, uint256)  {
      VideoInfo storage videoInfo = videos[sha3(_videoId)];
      return (videoInfo.owner, videoInfo.price);
    }

}

pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract VideoRegistry is Ownable {

    struct Stats {
        uint32 likes_percentage;
        uint32 views;
        uint32 likes;
        uint32 disklikes;
    }

    struct VideoInfo {
      bytes32 _id;
      string ipfs_hash;
      string title;
      string description;
      string thumb;
      string duration;
      uint256 price; // price in PTI-wei
      address owner;
      Stats stats;
    }

    mapping (bytes32=>VideoInfo) videos;

    event LogRegisterVideo(string videoId, address owner);
    event LogUnregisterVideo(string videoId);

    function VideoRegistry() {
        owner = msg.sender;
    }

    function registerVideo(string _videoId, address _owner, uint256 _price, string ipfs_hash) public onlyOwner {
      bytes32 id = sha3(_videoId);

      Stats memory _stats = Stats({
        likes_percentage: 0,
        views: 0,
        likes: 0,
        disklikes: 0
      });

      videos[id] = VideoInfo({
          _id: id,
          ipfs_hash: ipfs_hash,
          title: _videoId,
          description: "",
          thumb: "",
          duration: "",
          price: _price,
          owner: _owner,
          stats: _stats
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

pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract VideoRegistry is Ownable {

    struct Stats {
        uint256 views;
        uint256 likes;
        uint256 dislikes;
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

    function registerVideo(string _videoId, address _owner, uint256 _price, string _ipfs_hash) public onlyOwner {
      bytes32 id = sha3(_videoId);

      videos[id] = VideoInfo({
      _id: id,
      ipfs_hash: _ipfs_hash,
      title: _videoId,
      price: _price,
      owner: _owner,
      thumb: "",
      duration: "",
      description: "",
      stats: Stats({
        views: 0,
        likes: 0,
        dislikes: 0
        })
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
    
     function likeVideo(string _videoId, bool changed_opinion) {
         VideoInfo storage videoInfo = videos[sha3(_videoId)];
         videoInfo.stats.likes = videoInfo.stats.likes + 1;

         if (changed_opinion) {
             videoInfo.stats.dislikes = videoInfo.stats.dislikes - 1;
         }
    }
    
    function dislikeVideo(string _videoId, bool changed_opinion) {
         VideoInfo storage videoInfo = videos[sha3(_videoId)];
         videoInfo.stats.dislikes = videoInfo.stats.dislikes + 1;

         if (changed_opinion) {
             videoInfo.stats.likes = videoInfo.stats.likes - 1;
         }
    }

    function getStats(string _videoId) constant returns (uint256, uint256, uint256) {
         VideoInfo storage videoInfo = videos[sha3(_videoId)];
         Stats storage stats = videoInfo.stats;
         return (stats.views, stats.likes, stats.dislikes);
    }

}

pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract VideoRegistry is Ownable {

    using SafeMath for uint256;
    
    struct Stats {
        uint256 likes_percentage;
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

    function registerVideo(string _videoId, address _owner, uint256 _price, string ipfs_hash) public onlyOwner {
      bytes32 id = sha3(_videoId);

      Stats memory _stats = Stats({
        likes_percentage: 0,
        views: 0,
        likes: 0,
        dislikes: 0
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
    
     function likeVideo(string _videoId) {
         VideoInfo storage videoInfo = videos[sha3(_videoId)];
         Stats stats = videoInfo.stats;
         stats.likes = stats.likes + 1;
         stats.likes_percentage = stats.likes.mul(10 ** 18).div(stats.likes + stats.dislikes).div(10 ** 17);
         videoInfo.stats = stats;
         videos[sha3(_videoId)] = videoInfo;
    }
    
    function dislikeVideo(string _videoId) {
         VideoInfo storage videoInfo = videos[sha3(_videoId)];
         Stats stats = videoInfo.stats;
         stats.dislikes = stats.dislikes + 1;
         stats.likes_percentage = stats.likes.mul(10 ** 18).div(stats.likes + stats.dislikes).div(10 ** 17);
         videoInfo.stats = stats;
         videos[sha3(_videoId)] = videoInfo;
    }

    function getStats(string _videoId) returns (uint256, uint256, uint256, uint256) {
         VideoInfo storage videoInfo = videos[sha3(_videoId)];
         Stats stats = videoInfo.stats;
         return (stats.likes_percentage, stats.views, stats.likes, stats.dislikes);
    }

}

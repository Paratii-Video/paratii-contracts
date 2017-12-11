pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './ParatiiRegistry.sol';

contract VideoRegistry is Ownable {

    struct Stats {
        uint256 views;
        uint256 likes;
        uint256 dislikes;
    }

    struct VideoInfo {
      bytes32 _id;
      string ipfsHash;
      uint256 price; // price in PTI-wei
      address owner;
      Stats stats;
    }

    mapping (bytes32=>VideoInfo) videos;
    ParatiiRegistry paratiiRegistry;

    event LogRegisterVideo(string videoId, address owner, uint price, string ipfsHash);
    event LogUnregisterVideo(string videoId);

    modifier onlyUserRegistry() {
        require(msg.sender == paratiiRegistry.getContract('UserRegistry'));
        _;
    }

    function VideoRegistry(ParatiiRegistry _paratiiRegistry) {
        owner = msg.sender;
        paratiiRegistry = _paratiiRegistry;
    }

    function registerVideo(
        string _videoId,
        address _owner,
        uint256 _price,
        string _ipfsHash
    ) public onlyOwner {
        bytes32 id = keccak256(_videoId);

        videos[id] = VideoInfo({
            _id: id,
            price: _price,
            owner: _owner,
            ipfsHash: _ipfsHash,
            stats: Stats({
              views: 0,
              likes: 0,
              dislikes: 0
              })
          });

        LogRegisterVideo(_videoId, _owner, _price, _ipfsHash);
    }

    function unregisterVideo(string _videoId) public onlyOwner {
        delete videos[keccak256(_videoId)];
        LogUnregisterVideo(_videoId);
    }

    function getVideoInfo(string _videoId) public constant returns(address, uint256, string)  {
      VideoInfo storage videoInfo = videos[keccak256(_videoId)];
      return (videoInfo.owner, videoInfo.price, videoInfo.ipfsHash);
    }

    function likeVideo(string _videoId, bool changed_opinion) public onlyUserRegistry {
         VideoInfo storage videoInfo = videos[keccak256(_videoId)];
         videoInfo.stats.likes = videoInfo.stats.likes + 1;

         if (changed_opinion) {
             videoInfo.stats.dislikes = videoInfo.stats.dislikes - 1;
         }
    }

    function dislikeVideo(string _videoId, bool changed_opinion) public onlyUserRegistry {
         VideoInfo storage videoInfo = videos[keccak256(_videoId)];
         videoInfo.stats.dislikes = videoInfo.stats.dislikes + 1;

         if (changed_opinion) {
             videoInfo.stats.likes = videoInfo.stats.likes - 1;
         }
    }

    function getStats(string _videoId) public constant returns (uint256, uint256, uint256) {
         VideoInfo storage videoInfo = videos[keccak256(_videoId)];
         Stats storage stats = videoInfo.stats;
         return (stats.views, stats.likes, stats.dislikes);
    }
}

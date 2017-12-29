pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './Registry.sol';

contract Videos is Ownable {

    /*struct Stats {
        uint256 views;
        uint256 likes;
        uint256 dislikes;
    }
*/
    struct VideoInfo {
      bytes32 _id;
      string ipfsHash;
      string ipfsData;
      uint256 price; // price in PTI-wei
      address owner;
      address registrar; // the account that has registered this video
      /*Stats stats;*/
    }

    mapping (bytes32=>VideoInfo) videos;
    Registry public paratiiRegistry;

    event LogRegisterVideo(
      string videoId,
      address owner,
      uint price,
      string ipfsHash,
      address registrar
    );

    event LogUnregisterVideo(string videoId);

    // ???
    modifier onlyUserRegistry() {
        require(msg.sender == paratiiRegistry.getContract('Users'));
        _;
    }

    modifier onlyRegistrarOrAvatar(string _videoId) {
      bytes32 id = keccak256(_videoId);
      VideoInfo storage videoInfo = videos[id];
      require(msg.sender == owner || (videoInfo.registrar == 0 || msg.sender == videoInfo.registrar));
      _;
    }

    function Videos(Registry _paratiiRegistry) public {
        owner = msg.sender;
        paratiiRegistry = _paratiiRegistry;
    }

    /**
     * @dev Register a video
     * @param _videoId id of the video, can be any string
     * @param _owner the address of the owner of this video
     * @param _price the price in wei of this video
     * @param _ipfsHash the IPFS hash where a directory with videos in different formats can be found
     * @param _ipfsData the IPFS hash where a JSON with further information about htis video can be found
     **/

    function registerVideo(
        string _videoId,
        address _owner,
        uint256 _price,
        string _ipfsHash,
        string _ipfsData
    ) onlyRegistrarOrAvatar(_videoId) public {

        bytes32 id = keccak256(_videoId);

        videos[id] = VideoInfo({
            _id: id,
            price: _price,
            owner: _owner,
            ipfsHash: _ipfsHash,
            ipfsData: _ipfsData,
            registrar: msg.sender
          });

        LogRegisterVideo(_videoId, _owner, _price, _ipfsHash, msg.sender);
    }

    function unregisterVideo(string _videoId) public onlyRegistrarOrAvatar(_videoId) {
        bytes32 id = keccak256(_videoId);
        delete videos[id];
        LogUnregisterVideo(_videoId);
    }

    /**
     * @dev return information about video
     * @return a tuple (owner, price, ipfsHash, ipfsData, registrar)
     */

    function getVideoInfo(string _videoId) public constant
      returns(address, uint256, string, string, address)
    {
      VideoInfo storage videoInfo = videos[keccak256(_videoId)];
      return (videoInfo.owner, videoInfo.price, videoInfo.ipfsHash, videoInfo.ipfsData, videoInfo.registrar);
    }
/*
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
    }*/
}

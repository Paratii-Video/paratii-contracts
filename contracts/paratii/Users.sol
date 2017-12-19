pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import './Videos.sol';
import './Registry.sol';

contract Users is Ownable {

    Registry paratiiRegistry;
    Videos videoRegistry;

    struct VideoInfo { // user-related information about this video
      bool isAcquired; // did the user buy this video?
      bool liked; // did the user like this video
      bool disliked; // did the user dislike this video
      uint _index; // index in the UserInfo.videosIndex
    }

    struct UserInfo {
      address _address;
      string name;
      string email;
      string ipfsHash;
      bytes32[] videoIndex; // the videos this user has seen
      mapping (bytes32 => VideoInfo) videos; // information about these vids
    }

    mapping (address=>UserInfo) public users;

    event LogRegisterUser(address _address, string _name, string _email, string _ipfsHash);
    event LogUnregisterUser(address _address);
    event LogLikeVideo(address _address, string _videoId, bool _liked);

    modifier onlyOwnerOrUser(address _address) {
      require(msg.sender == owner || msg.sender == _address);
      _;
    }

    modifier isAcquired(string _videoId) {
        require(userAcquiredVideo(msg.sender, _videoId));
        _;
    }

    function Users(Registry _paratiiRegistry) public {
        owner = msg.sender;
        paratiiRegistry = _paratiiRegistry;
        videoRegistry = Videos(paratiiRegistry.getContract("Videos"));
    }

    function registerUser(address _userAddress, string _name, string _email, string _ipfsHash) public onlyOwnerOrUser(_userAddress) {
      bytes32[] memory emptyIndex;
      users[_userAddress] =  UserInfo({
          _address: _userAddress,
          name: _name,
          email: _email,
          ipfsHash: _ipfsHash,
          videoIndex: emptyIndex
      });

      LogRegisterUser(_userAddress, _name, _email, _ipfsHash);
    }

    function unregisterUser(address _userAddress) public onlyOwnerOrUser(_userAddress) {
        delete users[_userAddress];
    }

    function getUserInfo(address _userAddress) public constant returns(string, string, string) {
      UserInfo storage userInfo = users[_userAddress];
      return (userInfo.name, userInfo.email, userInfo.ipfsHash);
    }

    function acquireVideo(string _videoId, address _userAddress) public {
      VideoInfo storage video = users[_userAddress].videos[keccak256(_videoId)];
      video._index = users[_userAddress].videoIndex.push(keccak256(_videoId));
      video.isAcquired = true;
      users[_userAddress].videos[keccak256(_videoId)] = video;
    }

    /* like/dislike a video.
     * @param like If true, register a like, if false, register a dislike
     */
    function likeVideo(string _videoId, bool _liked) public isAcquired(_videoId) {
      address _userAddress = msg.sender;
      VideoInfo storage video = users[_userAddress].videos[keccak256(_videoId)];

      // if the video is not known yet
      if (video._index == 0) {
        acquireVideo(_videoId, _userAddress);
      }

      if (_liked && !video.liked) {
        video.liked = true;
        videoRegistry.likeVideo(_videoId, video.disliked);
        video.disliked = false;
        LogLikeVideo(_userAddress, _videoId, _liked);
      }

      if (!_liked && !video.disliked) {
        video.disliked = true;
        videoRegistry.dislikeVideo(_videoId, video.liked);
        video.liked = false;
        LogLikeVideo(_userAddress, _videoId, _liked);
      }
    }

    function userLikesVideo(address _userAddress, string _videoId) public constant returns(bool) {
      return users[_userAddress].videos[keccak256(_videoId)].liked;
    }

    function userDislikesVideo(address _userAddress, string _videoId) public constant returns (bool) {
      return users[_userAddress].videos[keccak256(_videoId)].disliked;
    }

    function userAcquiredVideo(address _userAddress, string _videoId) public constant returns(bool) {
      return users[_userAddress].videos[keccak256(_videoId)].isAcquired;
    }
}
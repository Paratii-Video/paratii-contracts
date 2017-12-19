pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './Registry.sol';

contract Likes is Ownable {

    address paratiiRegistry;

    // mapping from user addrsses and video ids to booleans
    mapping (address=> mapping (bytes32 => bool)) private _likes;
    mapping (address=> mapping (bytes32 => bool)) private _dislikes;
    // total of liks on a video
    mapping (address => uint) private _userLikes;
    mapping (address => uint) private _userDislikes;
    mapping (bytes32 => uint) private _vidLikes;
    mapping (bytes32 => uint) private _vidDislikes;

    event LogLikeVideo(address _address, string _videoId, bool _liked);

    function Likes(Registry _paratiiRegistry) public {
        owner = msg.sender;
        paratiiRegistry = _paratiiRegistry;
    }

   function likeVideo(string _videoId, bool _liked) public {
       address _address = msg.sender;
       bytes32 _videoHash = keccak256(_videoId);
       bool _userLikesVideo = userLikesVideo(_address, _videoId);
       bool _userDislikesVideo = userLikesVideo(_address, _videoId);
       LogLikeVideo(_address, _videoId, _liked);

       if (_liked && _userLikesVideo) {
           // this user already liked the video before
           return;
       }

       if (!_liked && _userDislikesVideo) {
           // this user already disliked the video before
           return;
       }

       if (_liked) {
           // msg.sender likes his video and did not do so before
           _likes[_address][_videoHash] = true;
           _userLikes[_address] += 1;
           _vidLikes[_videoHash] += 1;

           if (_userDislikesVideo) {
               _dislikes[_address][_videoHash] = false;
               _userDislikes[_address] -= 1;
           }

           LogLikeVideo(_address, _videoId, _liked);
        }

        if (!_liked && !_userDislikesVideo) {
            _likes[_address][keccak256(_videoId)] = false;
            _dislikes[_address][keccak256(_videoId)] = true;
            LogLikeVideo(_address, _videoId, _liked);
        }
    }

    function userLikes(address _address) public constant returns(uint) {
      return _userLikes[_address];
    }

    function userDislikes(address _address) public constant returns(uint)  {
      return _userLikes[_address];
    }

    function vidLikes(string _videoId) public constant returns(uint) {
      return _vidLikes[keccak256(_videoId)];
    }

    function vidDislikes(string _videoId) public constant returns(uint) {
      return _vidDislikes[keccak256(_videoId)];
    }

    function userLikesVideo(address _address, string _videoId) public constant returns(bool) {
        return _likes[_address][keccak256(_videoId)];
    }

    function userDislikesVideo(address _address, string _videoId) public constant returns(bool) {
        return _dislikes[_address][keccak256(_videoId)];
    }
}

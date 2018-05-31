pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import 'openzeppelin-solidity/contracts/math/SafeMath.sol';
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

    constructor(Registry _paratiiRegistry) public {
        owner = msg.sender;
        paratiiRegistry = _paratiiRegistry;
    }

    function likeVideo(string _videoId, bool _liked) public {
        address _address = msg.sender  ;
        bytes32 _videoHash = keccak256(_videoId);
        bool _userLikesVideo = userLikesVideo(_address, _videoId);
        bool _userDislikesVideo = userDislikesVideo(_address, _videoId);

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
                _vidDislikes[_videoHash] -= 1;
            }
            emit LogLikeVideo(_address, _videoId, _liked);
        }

        if (!_liked) {
            // msg.sender likes his video and did not do so before
            _dislikes[_address][_videoHash] = true;
            _userDislikes[_address] += 1;
            _vidDislikes[_videoHash] += 1;

            if (_userLikesVideo) {
                _likes[_address][_videoHash] = false;
                _userLikes[_address] -= 1;
                _vidLikes[_videoHash] -= 1;
            }
            emit LogLikeVideo(_address, _videoId, _liked);
            emit LogLikeVideo(_address, "this passed here", _liked);
        }
    }

    function userLikes(address _address) public view returns(uint) {
        return _userLikes[_address];
    }

    /**
     * @dev returns total of dislikes registered by this user
     * @param _address Address of the user
     */
    function userDislikes(address _address) public view returns(uint)  {
        return _userDislikes[_address];
    }

    function vidLikes(string _videoId) public view returns(uint) {
        return _vidLikes[keccak256(_videoId)];
    }

    function vidDislikes(string _videoId) public view returns(uint) {
        return _vidDislikes[keccak256(_videoId)];
    }

    function userLikesVideo(address _address, string _videoId) public view returns(bool) {
        return _likes[_address][keccak256(_videoId)];
    }

    function userDislikesVideo(address _address, string _videoId) public view returns(bool) {
        return _dislikes[_address][keccak256(_videoId)];
    }
}

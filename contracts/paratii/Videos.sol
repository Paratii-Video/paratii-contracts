pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/math/SafeMath.sol";
import "./Registry.sol";

contract Videos is Ownable {

    struct VideoInfo {
        bytes32 _id;
        string ipfsHashOrig; // the hash of the original file on IPFS
        string ipfsHash; // the hash of the streamable (transcoded) file on IPFS
        string ipfsData; // optional addition data about this video, stored in IPFS
        uint256 price; // price in PTI-wei
        address owner; // the owner
        address registrar; // the account that has registered this video and can update and delete the info
    }

    mapping (bytes32=>VideoInfo) videos;
    Registry public paratiiRegistry;

    event LogCreateVideo(
        string videoId,
        address owner,
        uint price,
        string ipfsHashOrig,
        string ipfsHash,
        string ipfsData,
        address registrar
    );

    event LogRemoveVideo(string videoId);

    // ???
    modifier onlyUserRegistry() {
        require(msg.sender == paratiiRegistry.getContract("Users"));
        _;
    }

    modifier onlyRegistrarOrAvatar(string _videoId) {
        bytes32 id = keccak256(_videoId);
        VideoInfo storage videoInfo = videos[id];
        require(msg.sender == owner || (videoInfo.registrar == 0 || msg.sender == videoInfo.registrar));
        _;
    }
    modifier onlyRegistrarOrAvatarOrOwner(string _videoId) {
        bytes32 id = keccak256(_videoId);
        VideoInfo storage videoInfo = videos[id];
        require(msg.sender == owner || (videoInfo.registrar == 0 || msg.sender == videoInfo.registrar || msg.sender == videoInfo.owner));
        _;
    }


    constructor(Registry _paratiiRegistry) public {
        owner = msg.sender;
        paratiiRegistry = _paratiiRegistry;
    }

    /**
     * @dev Register a video
     * @param _videoId id of the video, can be any string
     * @param _owner the address of the owner of this video
     * @param _price the price in wei of this video
     * @param _ipfsHashOrig the hash of the original file on IPFS
     * @param _ipfsHash the hash of the streamable (transcoded) file on IPFS
     * @param _ipfsData optional additional data about this video, stored in IPFS
     **/

    function create(
        string _videoId,
        address _owner,
        uint256 _price,
        string _ipfsHashOrig,
        string _ipfsHash,
        string _ipfsData
    ) onlyRegistrarOrAvatarOrOwner(_videoId) public {

        bytes32 id = keccak256(_videoId);

        videos[id] = VideoInfo({
            _id: id,
            price: _price,
            owner: _owner,
            ipfsHashOrig: _ipfsHashOrig,
            ipfsHash: _ipfsHash,
            ipfsData: _ipfsData,
            registrar: msg.sender
        });

        emit LogCreateVideo(_videoId, _owner, _price, _ipfsHashOrig, _ipfsHash, _ipfsData, msg.sender);
    }

    function remove(string _videoId) public onlyRegistrarOrAvatarOrOwner(_videoId) {
        bytes32 id = keccak256(_videoId);
        delete videos[id];
        emit LogRemoveVideo(_videoId);
    }

    /**
     * @dev return information about video
     * @return a tuple (owner, price, ipfsHashOrig, ipfsHash, ipfsData, registrar)
     */

    function get(string _videoId)
        public
        view
        returns(address, uint256, string, string, string, address)
    {
        VideoInfo storage videoInfo = videos[keccak256(_videoId)];
        return (videoInfo.owner, videoInfo.price, videoInfo.ipfsHashOrig, videoInfo.ipfsHash, videoInfo.ipfsData, videoInfo.registrar);
    }
}

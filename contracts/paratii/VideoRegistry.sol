pragma solidity ^0.4.13;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "./VideoContract.sol";

contract VideoRegistry is Ownable {

    mapping (bytes32=>address) public videos;

    event LogRegisterVideo(bytes32 hash, address owner);
    event LogUnregisterVideo(bytes32 hash);

    function VideoRegistry() {
        owner = msg.sender;
    }

    function registerVideo(bytes32 _hash, address video_contract) {
      videos[_hash] = video_contract;
      LogRegisterVideo(_hash, msg.sender);
    }

    function unregisterVideo(bytes32 _hash) onlyOwner {
        delete videos[_hash];
        LogUnregisterVideo(_hash);
    }
}

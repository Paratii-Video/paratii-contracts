pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import './Videos.sol';
import './Registry.sol';

contract Users is Ownable {

    Registry paratiiRegistry;
    Videos videoRegistry;

    struct UserInfo {
      string name;
      string email;
      string ipfsHash;
      string ipfsData;
    }

    mapping (address=>UserInfo) public users;

    event LogRegisterUser(
      address _address,
      string _name,
      string _email,
      string _ipfsHash,
      string _ipfsData
    );

    event LogUnregisterUser(address _address);

    modifier onlyOwnerOrUser(address _address) {
      require(msg.sender == owner || msg.sender == _address);
      _;
    }

    function Users(Registry _paratiiRegistry) public {
        owner = msg.sender;
        paratiiRegistry = _paratiiRegistry;
    }

    /**
     * @dev Register a new user
     * @param _address - the ethereum address of the user
     * @param _name - the name of the user
     * @param _email - the email address of the user
     * @param _ipfsHash - the hash of the directory where video formats can be found
     * @param _ipfsData - the hash of a JSON file with data of the video
     */
    function registerUser(
      address _address,
      string _name,
      string _email,
      string _ipfsHash,
      string _ipfsData
    ) public onlyOwnerOrUser(_address) {
      users[_address] =  UserInfo({
          name: _name,
          email: _email,
          ipfsHash: _ipfsHash,
          ipfsData: _ipfsData
      });

      LogRegisterUser(_address, _name, _email, _ipfsHash, _ipfsData);
    }

    /**
     * @dev unregister a User
     * Deletes the data of the user from users
     * @param _address the address of the user to be unregistered
     */
    function unregisterUser(address _address) public onlyOwnerOrUser(_address) {
        delete users[_address];
        LogUnregisterUser(_address);
    }

    /**
     * @dev return information about the user
     * @param _address the address of the user
     * @return a tuple (name, email, ipfsHash, ipfsData)
     */
    function getUserInfo(address _address) public constant returns(string, string, string, string) {
      UserInfo storage userInfo = users[_address];
      return (userInfo.name, userInfo.email, userInfo.ipfsHash, userInfo.ipfsData);
    }
}

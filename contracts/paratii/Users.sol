pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import './Registry.sol';

contract Users is Ownable {

    Registry registry;

    struct UserInfo {
      string name;
      string email;
      string ipfsData;
    }

    mapping (address=>UserInfo) public users;

    event LogCreateUser(
      address indexed _address,
      string _name,
      string _email,
      string _ipfsData
    );

    event LogRemoveUser(address indexed _address);

    modifier onlyOwnerOrUser(address _address) {
      require(msg.sender == owner || msg.sender == _address);
      _;
    }

    constructor(Registry _registry) public {
        owner = msg.sender;
        registry = _registry;
    }

    /**
     * @dev Register a new user
     * @param _address - the ethereum address of the user
     * @param _name - the name of the user
     * @param _email - the email address of the user
     * @param _ipfsData - the hash of a JSON file with data of the video
     */
    function create(
      address _address,
      string _name,
      string _email,
      string _ipfsData
    ) public onlyOwnerOrUser(_address) {
      users[_address] =  UserInfo({
          name: _name,
          email: _email,
          ipfsData: _ipfsData
      });

      emit LogCreateUser(_address, _name, _email, _ipfsData);
    }

    /**
     * @dev unregister a User
     * Deletes the data of the user from users
     * @param _address the address of the user to be unregistered
     */
    function remove(address _address) public onlyOwnerOrUser(_address) {
        delete users[_address];
        emit LogRemoveUser(_address);
    }

    /**
     * @dev return information about the user
     * @param _address the address of the user
     * @return a tuple (name, email, ipfsData)
     */
    function get(address _address) public view returns(string, string, string) {
      UserInfo storage userInfo = users[_address];
      return (userInfo.name, userInfo.email, userInfo.ipfsData);
    }
}

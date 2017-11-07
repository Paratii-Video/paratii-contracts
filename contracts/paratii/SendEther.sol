pragma solidity ^0.4.17;

/**
 * @title SendEther
 * @dev A Contract that wraps the native transfer function and logs an event.
 */

contract SendEther {

    event LogSendEther(
      address from,
      address to,
      uint value,
      string description
    );

    // If someone accidentally sends ether to this contract, revert;
    function () {
        revert();
    }

    /**
     * @dev Transfer ether to address _to, providing a description
     * The only difference with sending ETH directly is that the action is logged
     * @param _to recipient of the ETH
     * @param _description  A description to log
     */
    function transfer(address _to, string _description) payable returns(bool)  {
       _to.transfer(msg.value);
       LogSendEther(msg.sender, _to, msg.value, _description);
       return true;
    }

}

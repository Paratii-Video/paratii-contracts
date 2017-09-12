pragma solidity ^0.4.13;

/**
 * @title SentEther
 * @dev A Contract that wraps the native transfer function and logs an event.
 */

contract SendEther {

    event LogSendEther(
      address to,
      uint value,
      string description
    );
    
    // If someone accidentally sends ether to this contract, revert;
    function () {
        revert();
    }

    function transfer(address _to, string _description) payable returns(bool)  {
       _to.transfer(msg.value);
       LogSendEther(_to, msg.value, _description);
       return true;
    }

}

pragma solidity >0.4.99 <0.6.0;

contract Account {
  address public owner;

    event accountOwnerchanged(address oldOwner, address newOwner);
  constructor(address payable _owner) public {
    owner = _owner;
  }

  function setOwner(address _owner) public {
    require(msg.sender == owner, "Message Sender is not Owner");
    address oldOwner = owner;
    owner = _owner;
    emit accountOwnerchanged(oldOwner, _owner);
  }

  function destroy(address payable recipient) public {
    require(msg.sender == owner, "Message Sender is not Owner");
    selfdestruct(recipient);
  }

  function() external payable  {}
}
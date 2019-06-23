pragma solidity ^0.5.4;

import "contracts/openzeppelin-eth/roles/WhitelistAdminRole.sol";
import "contracts/openzeppelin-eth/roles/WhitelistedRole.sol";

contract Refund is WhitelistAdminRole, WhitelistedRole {

    uint256 refundAmount = 1;
    bool refunded;
    //This contract sends back to the person who instantiates the cost for having deployed it

    event refund(address recipient, uint amount);
    function refundCreator(address _refundAddress) public onlyWhitelistAdmin() {
        require((!refunded), "Contract has already been refunded");
        if(_refundAddress != address(0x0000000000000000000000000000000000000000)){
            _refundAddress.transfer(refundAmount);
            emit refund(_refundAddress, refundAmount);
        }
    }
}
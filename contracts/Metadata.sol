pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "contracts/openzeppelin-eth/roles/WhitelistAdminRole.sol";
import "contracts/openzeppelin-eth/roles/WhitelistedRole.sol";
import "openzeppelin-solidity/contracts/drafts/Counters.sol";

contract Metadata is WhitelistAdminRole, WhitelistedRole {
    using Counters for Counters.Counter;
    Counters.Counter public metadataCount;

    string[] public metadata;

    event metadataAdded(address identity, string metadata);

    function addIdMetadata(string calldata _metadata) external onlyWhitelistAdmin() {
        metadata.push(_metadata);
        metadataCount.increment();
        emit metadataAdded(address(this), _metadata);
    }

    function getTotalMetadata() view public returns(uint256){
        return metadataCount.current();
    }

    function getSingleIdMetaData(uint _index) external returns(string memory item){
        require(_index <= metadata.length, "Metadata record does not exist");
        return metadata[_index];
    }
}
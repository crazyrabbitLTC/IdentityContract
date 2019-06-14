pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "./ProxyAccount.sol";

contract Identity is ProxyAccount {

    string[] public metadata;

    event metaDataAdded(address identity, string metadata);

    function addIdMetadata(string calldata _metadata) external onlyWhitelistAdmin() {
        metadata.push(_metadata);
        emit metaDataAdded(address(this), _metadata);
    }

    function getAllIdMetadata() external returns(string[] memory){
        return metadata;
    }

    function getSingleIdMetaData(uint _index) external returns(string memory item){
        require(_index <= metadata.length, "Metadata record does not exist");
        return metadata[_index];
    }


}
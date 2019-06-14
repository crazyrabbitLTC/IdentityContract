pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;

import "./ProxyAccount.sol";

contract Identity is ProxyAccount {

string[] private metadata;

event metaDataAdded(address identity, string metadata);

function addMetadata(string memory _metadata) onlyWhitelistAdmin() public{
    
    metadata.push(_metadata);
    emit metaDataAdded(address(this), _metadata);
}

function getAllMetadata() public returns(string[] memory metadata){
    return metadata;
}

function getSingleMetaData(uint _index) public returns(string memory item){
    require(_index <= metadata.length, "Metadata record does not exist");
    return metadata[_index];
}


}
pragma solidity ^0.5.4;

contract MultiSigRecovery {

    uint sigCountRequired;
    constructor(bytes32[] memory _signaturesRequired) public {
        sigCountRequired = _signatures.length();
    }

}
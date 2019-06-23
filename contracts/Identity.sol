pragma solidity ^0.5.4;



//import "./ERC725.sol";
import "./GSN.sol";
import "./SocialRecovery.sol";
import "./ExecuteCall.sol";
import "./KeyData.sol";
import "./Metadata.sol";
import "zos-lib/contracts/Initializable.sol";
import "contracts/openzeppelin-eth/roles/WhitelistedRole.sol";
import "contracts/GnosisMultiSig/MultiSigWalletFactory.sol";


//Mostly copied from https://github.com/ethereum/EIPs/blob/master/EIPS/eip-725.md
contract Identity is GSN, SocialRecovery, ExecuteCall, KeyData, Metadata {

    address public owner;
    event OwnerChanged(address indexed ownerAddress);

    function () external payable {}


    function changeOwner(address _owner)
        external
        onlyWhitelistAdmin()
    {
        owner = _owner;
        emit OwnerChanged(owner);
    }



}
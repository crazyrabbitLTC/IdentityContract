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
    event EthSent(address recipient, uint256 value);

    function () external payable {}


    function changeOwner(address _owner)
        external
        onlyWhitelistAdmin()
    {
        owner = _owner;
        emit OwnerChanged(owner);
    }

    function sendEth(address payable _recipient, uint256 _valueInWei) external onlyWhitelistAdmin(){
       _recipient.transfer(_valueInWei);
        emit EthSent(_recipient, _valueInWei);
    }


}
    pragma solidity ^0.5.4;
    
    import "contracts/openzeppelin-eth/roles/WhitelistAdminRole.sol";
    import "contracts/openzeppelin-eth/roles/WhitelistedRole.sol";
    import "contracts/GnosisMultiSig/MultiSigWalletFactory.sol";
    
    contract SocialRecovery is WhitelistAdminRole, WhitelistedRole {

    MultiSigWalletFactory multiSigWalletFactory;
    
    function addSocialRecovery(address[] calldata _owners, uint _required) external onlyWhitelistAdmin(){
        address socialRecoveryAddress = multiSigWalletFactory.create(_owners, _required);
        addWhitelistAdmin(socialRecoveryAddress);

    }

    function addSocialRecoveryAddress(MultiSigWalletFactory _multiSigWalletFactory) public onlyWhitelistAdmin() {
        multiSigWalletFactory = _multiSigWalletFactory;
    }
    }
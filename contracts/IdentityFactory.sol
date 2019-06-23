pragma solidity ^0.5.4;

import "./Identity.sol";
import "openzeppelin-solidity/contracts/drafts/Counters.sol";
import "zos-lib/contracts/Initializable.sol";
import "contracts/GnosisMultiSig/MultiSigWalletFactory.sol";
import "./GSN.sol";


contract IdentityFactory is Initializable, GSN {

    using Counters for Counters.Counter;
    Counters.Counter public identityCount;

    MultiSigWalletFactory private multiSigWalletFactory;
    bool public contractInitialized;

    mapping(uint => Identity) public identities;

    event identityCreated(address identityAddress, address owner, uint identityId, string metadata);
    event identityFactoryCreated(address factoryAddress, address multiSigAddress);

    function initialize(MultiSigWalletFactory _multiSig) public initializer  {
        multiSigWalletFactory = _multiSig;
        contractInitialized = true;
        emit identityFactoryCreated(address(this), address(multiSigWalletFactory));
    }

    function createIdentity(address _initialOwner, string calldata _metadata) external {
        uint identityId = identityCount.current();
        Identity identity;
        identity = new Identity();
        identity.initialize(address(this));
        identity.addWhitelistAdmin(_initialOwner);
        identity.changeOwner(_initialOwner);
        identity.addIdMetadata(_metadata);
        identity.addSocialRecoveryAddress(multiSigWalletFactory);
        identity.renounceWhitelistAdmin();
        identities[identityId] = identity;
        identityCount.increment();
        emit identityCreated(address(identity), get_sender(), identityId, _metadata);
    }



}
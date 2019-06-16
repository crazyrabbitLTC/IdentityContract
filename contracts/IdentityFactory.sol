pragma solidity ^0.5.4;

import "./Identity.sol";
import "openzeppelin-solidity/contracts/drafts/Counters.sol";
import "zos-lib/contracts/Initializable.sol";
import "tabookey-gasless/contracts/RelayRecipient.sol";
import "contracts/GnosisMultiSig/MultiSigWalletFactory.sol";


contract IdentityFactory is RelayRecipient, Initializable {

    using Counters for Counters.Counter;
    Counters.Counter public identityCount;

    MultiSigWalletFactory private multiSigWalletFactory;
    bool public contractInitialized;

    mapping(uint => Identity) public identities;

    event identityCreated(address identityAddress, address owner, uint identityId);
    event identityFactoryCreated(address factoryAddress, address multiSigAddress);

    function initialize(MultiSigWalletFactory _multiSig) initializer public {
        multiSigWalletFactory = _multiSig;
        contractInitialized = true;
        emit identityFactoryCreated(address(this), address(multiSigWalletFactory));
    }

    function createIdentity(address _owner, string calldata _metadata) external {
        uint identityId = identityCount.current();
        Identity identity;
        identity = new Identity();
        identity.initialize2(_owner, multiSigWalletFactory);
        identity.addIdMetadata(_metadata);
        identities[identityId] = identity;
        identityCount.increment();
        emit identityCreated(address(identity), _owner, identityId);
    }

        /*
    @GSN FUNCTIONS
    */
    function accept_relayed_call(address /*relay*/, address /*from*/,
        bytes memory /*encoded_function*/, uint /*gas_price*/, 
        uint /*transaction_fee*/ ) public view returns(uint32) {
    return 0; // accept everything.
    }
    // nothing to be done post-call.
    // still, we must implement this method.
    function post_relayed_call(address /*relay*/, address /*from*/,
        bytes memory /*encoded_function*/, bool /*success*/,
        uint /*used_gas*/, uint /*transaction_fee*/ ) public {
    }

    function init_hub(RelayHub hub_addr) public {
    init_relay_hub(hub_addr);
    }




}
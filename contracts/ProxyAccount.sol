pragma solidity ^0.5.4;

import "./ERC725.sol";
import "zos-lib/contracts/Initializable.sol";
import "openzeppelin-eth/contracts/access/roles/WhitelistAdminRole.sol";
import "openzeppelin-eth/contracts/access/roles/WhitelistedRole.sol";
import "contracts/GnosisMultiSig/MultiSigWalletFactory.sol";
import "tabookey-gasless/contracts/RelayRecipient.sol";



//Mostly copied from https://github.com/ethereum/EIPs/blob/master/EIPS/eip-725.md
contract ProxyAccount is ERC725, MultiSigWalletFactory, WhitelistAdminRole, WhitelistedRole, RelayRecipient {

    uint256 constant OPERATION_CALL = 0;
    uint256 constant OPERATION_CREATE = 1;

    mapping(bytes32 => bytes) store;

    address public owner;

    //Social Recovery

    function addSocialRecovery(address[] calldata _owners, uint _required) external onlyWhitelistAdmin(){
        address socialRecoveryAddress = MultiSigWalletFactory.create(_owners, _required);
        addWhitelistAdmin(socialRecoveryAddress);

    }

    function initialize(address _owner) initializer public {
        owner = _owner;
        WhitelistAdminRole.initialize(_owner);
    }


    /*
    @ GSN FUNCTIONS
    */
    function accept_relayed_call(address /*relay*/, address /*from*/,
        bytes memory /*encoded_function*/, uint /*gas_price*/, 
        uint /*transaction_fee*/ ) public view returns(uint32) {
        return 0; // accept everything.
    }

    function post_relayed_call(address /*relay*/, address /*from*/,
        bytes memory /*encoded_function*/, bool /*success*/,
        uint /*used_gas*/, uint /*transaction_fee*/ ) public {
    }

    function init_hub(RelayHub hub_addr) public {
        init_relay_hub(hub_addr);
    }
    /*
    */

    /*
    @ Public Functions
    */
    function () external payable {}


    function changeOwner(address _owner)
        external
        onlyWhitelistAdmin()
    {
        owner = _owner;
        emit OwnerChanged(owner);
    }

    function getData(bytes32 _key)
        external
        view
        returns (bytes memory _value)
    {
        return store[_key];
    }

    function setData(bytes32 _key, bytes calldata _value)
        external
        onlyWhitelistAdmin()
    {
        store[_key] = _value;
        emit DataChanged(_key, _value);
    }

    function execute(uint256 _operationType, address _to, uint256 _value, bytes calldata _data)
        external
        onlyWhitelistAdmin()
    {
        if (_operationType == OPERATION_CALL) {
            executeCall(_to, _value, _data);
        } else if (_operationType == OPERATION_CREATE) {
            address newContract = executeCreate(_data);
            emit ContractCreated(newContract);
        } else {
            // We don't want to spend users gas if parametar is wrong
            revert();
        }
    }

    // copied from GnosisSafe
    // https://github.com/gnosis/safe-contracts/blob/v0.0.2-alpha/contracts/base/Executor.sol
    function executeCall(address to, uint256 value, bytes memory data)
        internal
        returns (bool success)
    {
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            success := call(gas, to, value, add(data, 0x20), mload(data), 0, 0)
        }
    }

    // copied from GnosisSafe
    // https://github.com/gnosis/safe-contracts/blob/v0.0.2-alpha/contracts/base/Executor.sol
    function executeCreate(bytes memory data)
        internal
        returns (address newContract)
    {
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            newContract := create(0, add(data, 0x20), mload(data))
        }
    }
}
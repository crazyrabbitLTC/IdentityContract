pragma solidity ^0.5.4;
pragma experimental ABIEncoderV2;


import "./ERC725.sol";
import "zos-lib/contracts/Initializable.sol";
import "contracts/openzeppelin-eth/roles/WhitelistAdminRole.sol";
import "contracts/openzeppelin-eth/roles/WhitelistedRole.sol";
import "contracts/GnosisMultiSig/MultiSigWalletFactory.sol";


//Mostly copied from https://github.com/ethereum/EIPs/blob/master/EIPS/eip-725.md
contract Identity is ERC725, WhitelistAdminRole, WhitelistedRole {

    uint256 constant OPERATION_CALL = 0;
    uint256 constant OPERATION_CREATE = 1;
    uint256 constant OPERATION_CREATE2 = 2;

    MultiSigWalletFactory multiSigWalletFactory;

    mapping(bytes32 => bytes) store;

    address public owner;

    string[] public metadata;

    event metaDataAdded(address identity, string metadata);
    event callExecuted(bool success);
    event contractCreated(address contractAddress, uint256 contractType, address creatingContract);


    //Social Recovery

    function addSocialRecovery(address[] calldata _owners, uint _required) external onlyWhitelistAdmin(){
        address socialRecoveryAddress = multiSigWalletFactory.create(_owners, _required);
        addWhitelistAdmin(socialRecoveryAddress);

    }

    function addSocialRecoveryAddress(MultiSigWalletFactory _multiSigWalletFactory) onlyWhitelistAdmin() public {
        // owner = get_sender();
        // //WhitelistAdminRole.initialize(get_sender());
        // //WhitelistAdminRole.addWhitelistAdmin(get_sender());
        multiSigWalletFactory = _multiSigWalletFactory;
    }

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

    function execute(uint256 _operationType, address _to, uint256 _value, bytes calldata _data, uint256 salt) external onlyWhitelistAdmin(){
        if (_operationType == OPERATION_CALL) {
            executeCall(_to, _value, _data);
        } else if (_operationType == OPERATION_CREATE) {
            address newContract = executeCreate(_data);
            emit contractCreated(newContract, OPERATION_CREATE, address(this));
        } else if (_operationType == OPERATION_CREATE2){
            address newContract = executeCreate2(_data, salt);
            emit contractCreated(newContract, OPERATION_CREATE2, address(this));
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
        emit callExecuted(true);
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

        return newContract;
    }

    //copied from: https://github.com/miguelmota/solidity-create2-example/blob/master/test/test.js
    function executeCreate2(bytes memory code, uint256 salt) internal returns (address newContract) {
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            newContract := create2(0, add(code, 0x20), mload(code), salt)
            if iszero(extcodesize(newContract)) {
                revert(0, 0)
            }
        }
        return newContract;
    }
}
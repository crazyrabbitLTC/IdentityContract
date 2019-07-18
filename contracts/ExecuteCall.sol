pragma solidity ^0.5.4;

import "contracts/openzeppelin-eth/roles/WhitelistAdminRole.sol";
import "contracts/openzeppelin-eth/roles/WhitelistedRole.sol";

contract ExecuteCall is WhitelistAdminRole, WhitelistedRole {

    uint256 constant OPERATION_CALL = 0;
    uint256 constant OPERATION_CREATE = 1;
    uint256 constant OPERATION_CREATE2 = 2;

    event callExecuted(bool success);
    event contractCreated(address contractAddress, uint256 contractType, address creatingContract);
    event callExecuted(address to, uint256 value, bytes data);

    function execute(uint256 _operationType, address _to, uint256 _value, bytes calldata _data, uint256 salt) external onlyWhitelistAdmin(){
        if (_operationType == OPERATION_CALL) {
            executeCall(_to, _value, _data);
            emit callExecuted(_to, _value, _data);
        } else if (_operationType == OPERATION_CREATE) {
            address newContract = executeCreate(_data);
            emit contractCreated(newContract, OPERATION_CREATE, address(this));
        } else if (_operationType == OPERATION_CREATE2){
            address newContract = executeCreate2(_data, salt);
            emit contractCreated(newContract, OPERATION_CREATE2, address(this));
        } else {
            // We don't want to spend users gas if parametar is wrong
            revert("Inccorect operation type");
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
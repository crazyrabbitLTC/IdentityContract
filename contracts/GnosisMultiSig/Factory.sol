pragma solidity ^0.5.4;

import "tabookey-gasless/contracts/RelayRecipient.sol";

contract Factory is RelayRecipient {

    /*
     *  Events
     */
    event ContractInstantiation(address sender, address instantiation);

    /*
     *  Storage
     */
    mapping(address => bool) public isInstantiation;
    mapping(address => address[]) public instantiations;

    /*
     * Public functions
     */
    /// @dev Returns number of instantiations by creator.
    /// @param creator Contract creator.
    /// @return Returns number of instantiations by creator.
    function getInstantiationCount(address creator)
        public
        view
        returns (uint)
    {
        return instantiations[creator].length;
    }

    /*
     * Internal functions
     */
    /// @dev Registers contract in factory registry.
    /// @param instantiation Address of contract instantiation.
    function register(address instantiation)
        internal
    {
        isInstantiation[instantiation] = true;
        instantiations[get_sender()].push(instantiation);
        emit ContractInstantiation(get_sender(), instantiation);
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

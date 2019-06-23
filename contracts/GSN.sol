pragma solidity ^0.5.4;

import "tabookey-gasless/contracts/RelayRecipient.sol";


contract GSN is RelayRecipient {

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

}
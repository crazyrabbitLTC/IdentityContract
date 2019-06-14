pragma solidity ^0.5.4;
import "contracts/GnosisMultiSig/Factory.sol";
import "contracts/GnosisMultiSig/MultiSigWallet.sol";


/// @title Multisignature wallet factory - Allows creation of multisig wallet.
/// @author Stefan George - <stefan.george@consensys.net>
contract MultiSigWalletFactory is Factory{

    /*
     * Public functions
     */
    /// @dev Allows verified creation of multisignature wallet.
    /// @param _owners List of initial owners.
    /// @param _required Number of required confirmations.
    /// @return Returns wallet address.
    function create(address[] memory _owners, uint _required)
        public
        returns (address wallet)
    {
        wallet = address(new MultiSigWallet(_owners, _required));
        //register(wallet);
    }
}

// Import all required modules from openzeppelin-test-helpers
const {
  BN,
  constants,
  expectEvent,
  expectRevert
} = require("openzeppelin-test-helpers");

const { expect } = require("chai");

const IdentityFactory = artifacts.require("IdentityFactory");
const MultiSigWalletFactory = artifacts.require("MultiSigWalletFactory");
const Identity = artifacts.require("Identity");
const AccountContract = artifacts.require("Account");

contract("Identity: Create2", ([sender, receiver, thirdperson, fourthperson]) => {
  let identity = null;

  // converts an int to uint256
  function numberToUint256(value) {
    const hex = value.toString(16);
    return `0x${"0".repeat(64 - hex.length)}${hex}`;
  }


  beforeEach(async function() {
    this.multiSigWalletFactory = await MultiSigWalletFactory.new();
    this.identityFactory = await IdentityFactory.new();

    await this.identityFactory.initialize(this.multiSigWalletFactory.address, {
      from: sender
    });

    const { logs } = await this.identityFactory.createIdentity(
      sender,
      "Hello Metadata",
      { from: sender }
    );

    identityAddress = logs[0].args.identityAddress;
    registeredOwner = logs[0].args.owner;

    identity = await Identity.at(identityAddress);
  });

  it("Identity deployed a Standard  contract", async () => {
    const { abi: accountAbi, bytecode: accountBytecode } = AccountContract;

    const { logs } = await identity.execute(
      1,
      sender,
      0,
      accountBytecode,
      0,
      { from: sender }
    );

    expectEvent.inLogs(logs, "contractCreated", {
      contractType: new BN(1)
    });
  });



  it("Should not deploy a contract if the sender is not whitelisted", async () => {
    const { abi: accountAbi, bytecode: accountBytecode } = AccountContract;
    await expectRevert(identity.execute(
      2,
      sender,
      0,
      accountBytecode,
      0,
      { from: thirdperson }
    ), "The message sender is not an admin");
  });
});

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

contract("Create2", ([sender, receiver, thirdperson, fourthperson]) => {
  let identity = null;
  const buildCreate2Address = (creatorAddress, saltHex, byteCode) => {
    return `0x${web3.utils
      .sha3(
        `0x${["ff", creatorAddress, saltHex, web3.utils.sha3(byteCode)]
          .map(x => x.toString().replace(/0x/, ""))
          .join("")}`
      )
      .slice(-40)}`.toLowerCase();
  };

  // converts an int to uint256
  function numberToUint256(value) {
    const hex = value.toString(16);
    return `0x${"0".repeat(64 - hex.length)}${hex}`;
  }

  // encodes parameter to pass as contract argument
  function encodeParam(dataType, data) {
    return web3.eth.abi.encodeParameter(dataType, data);
  }

  // returns true if contract is deployed on-chain
  async function isContract(address) {
    const code = await web3.eth.getCode(address);
    return code.slice(2).length > 0;
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

  it("Deployed a Create2 contract", async () => {
    const { abi: accountAbi, bytecode: accountBytecode } = AccountContract;

    let salt = 1;

    const create2CalculatedAddress = buildCreate2Address(
      identityAddress,
      numberToUint256(salt),
      accountBytecode
    );

    const { logs } = await identity.execute(
      2,
      sender,
      0,
      accountBytecode,
      salt,
      { from: sender }
    );

    expectEvent.inLogs(logs, "contractCreated", {
      contractAddress: web3.utils.toChecksumAddress(create2CalculatedAddress),
      contractType: new BN(2)
    });
  });
});

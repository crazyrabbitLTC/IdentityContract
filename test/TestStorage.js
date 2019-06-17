// Import all required modules from openzeppelin-test-helpers
const {
  BN,
  constants,
  expectEvent,
  expectRevert
} = require("openzeppelin-test-helpers");

// Import preferred chai flavor: both expect and should are supported
const { expect } = require("chai");

const IdentityFactory = artifacts.require("IdentityFactory");
const MultiSigWalletFactory = artifacts.require("MultiSigWalletFactory");

contract("MultiSigWalletFactory", ([sender, receiver, thirdperson]) => {
  beforeEach(async function() {
    this.multiSigWalletFactory = await MultiSigWalletFactory.new();
    this.identityFactory = await IdentityFactory.new();
  });

  it("initialized the IdentityFacotry", async function() {
    const { logs } = await this.identityFactory.initialize(
      this.multiSigWalletFactory.address,
      { from: sender }
    );
    expectEvent.inLogs(logs, "identityFactoryCreated", {
      factoryAddress: this.identityFactory.address,
      multiSigAddress: this.multiSigWalletFactory.address
    });
  });

  it("Created an Identity from original owner address", async function() {
    const metadata = "Helllooo!!!";
    const { logs } = await this.identityFactory.createIdentity(
      sender,
      metadata,
      { from: sender }
    );
    expectEvent.inLogs(logs, "identityCreated", {
      owner: sender,
      metadata: metadata
    });
  });
});

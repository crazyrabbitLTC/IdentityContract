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

contract("Identity", ([sender, receiver, thirdperson]) => {
  const metadata = "Helllooo!!!";
  let identityAddress = null;
  this.identity = null;
  this.registeredOwner = null;

  beforeEach(async function() {
    this.multiSigWalletFactory = await MultiSigWalletFactory.new();
    this.identityFactory = await IdentityFactory.new();

    await this.identityFactory.initialize(this.multiSigWalletFactory.address, {
      from: sender
    });

    const { logs } = await this.identityFactory.createIdentity(
      sender,
      metadata,
      { from: sender }
    );

    identityAddress = logs[0].args.identityAddress;
    registeredOwner = logs[0].args.owner;

    this.identity = await Identity.at(identityAddress);
    console.log(`The sender: ${sender} the owner: ${registeredOwner}`);
  });

  it("Expect the identity to belong to sender", async function() {
    const metadata = "Helllooo!!!";
    const owner = await this.identity.owner();

    expect(owner).to.be.equal(sender);
  });
});

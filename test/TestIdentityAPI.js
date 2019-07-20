// Import all required modules from openzeppelin-test-helpers
const {
  BN,
  constants,
  expectEvent,
  expectRevert
} = require("openzeppelin-test-helpers");

const {getEncodedCall, encodeParam, getCreate2Address, numberToUint256 } = require("../client/src/utils/identityUtils");

const { expect } = require("chai");

const IdentityFactory = artifacts.require("IdentityFactory");
const MultiSigWalletFactory = artifacts.require("MultiSigWalletFactory");
const Identity = artifacts.require("Identity");
const AccountContract = artifacts.require("Account");

contract("Identity Factory", ([sender, receiver, thirdperson]) => {
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

contract("Identity", ([sender, receiver, thirdperson, fourthperson]) => {
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


  });

  it("Expect the identity to belong to sender", async function() {
    const metadata = "Helllooo!!!";
    const owner = await this.identity.owner();

    expect(owner).to.be.equal(sender);
  });

  it("Change the Owner to a new users", async function() {
    
    const result = await this.identity.changeOwner(receiver, {from: sender});
    const newOwner = await this.identity.owner();
    expect(newOwner).to.be.equal(receiver);
    expect(newOwner).to.not.be.equal(sender);
  })

  it("Add additional Address to White list", async function() {
    const { logs } = await this.identity.addWhitelistAdmin(thirdperson, {
      from: sender
    });
    expectEvent.inLogs(logs, "WhitelistAdminAdded", {
      account: thirdperson
    });
  });

  it("Should not allow unauthorized person to add to whitelist", async function() {
    await expectRevert(
      this.identity.addWhitelistAdmin(fourthperson, { from: receiver }),
      "The message sender is not an admin"
    );
  });

  it("Should add metadata and emit and event", async function() {
    const metadata = "This is my metadata";
    const { logs } = await this.identity.addIdMetadata(metadata, {
      from: sender
    });
    expectEvent.inLogs(logs, "metadataAdded", {
      identity: this.identity.address,
      metadata: metadata
    });
  });

  it("Should be able to retrieve all metadata", async function() {
    const metadata = "This is my metadata";
    const { logs } = await this.identity.addIdMetadata(metadata, {
      from: sender
    });

    const result = await this.identity.metadata(1);

    expect(result).to.equal(metadata);
  });

  it("Should be able to retrieve metadata count", async function() {
    const number = new BN(2);
    const metadata = "This is my metadata";
    await this.identity.addIdMetadata(metadata, {
      from: sender
    });
    const result = await this.identity.getTotalMetadata();

    expect(result.toString()).to.equal(number.toString());
  });
});

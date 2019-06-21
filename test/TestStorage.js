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
    console.log(`The sender: ${sender} the owner: ${registeredOwner}`);
  });

  it("Deployed a Create2 contract", async () => {
    const { abi: accountAbi, bytecode: accountBytecode } = AccountContract;

    //require("../build/contracts/Account.json");

    let salt = 1;
    let address = identityAddress;
    const create2CalculatedAddress = buildCreate2Address(
      address,
      salt,
      accountBytecode
    );
    console.log("The create2CalculatedAddress is: ", create2CalculatedAddress);
    //const bytecode = `${accountBytecode}${encodeParam('address', '0x303de46de694cc75a2f66da93ac86c6a6eee607e').slice(2)}`
    //console.log(identity.methods);

    //executeCreate2(bytes memory code, uint256 salt)
    const { logs } = await identity.execute(
      2,
      sender,
      0,
      accountBytecode,
      salt,
      { from: sender }
    );

    console.log("If it worked, here are the logs: ", logs);
  });
});

// contract("MultiSigWalletFactory", ([sender, receiver, thirdperson]) => {
//   beforeEach(async function() {
//     this.multiSigWalletFactory = await MultiSigWalletFactory.new();
//     this.identityFactory = await IdentityFactory.new();
//   });

//   it("initialized the IdentityFacotry", async function() {
//     const { logs } = await this.identityFactory.initialize(
//       this.multiSigWalletFactory.address,
//       { from: sender }
//     );
//     expectEvent.inLogs(logs, "identityFactoryCreated", {
//       factoryAddress: this.identityFactory.address,
//       multiSigAddress: this.multiSigWalletFactory.address
//     });
//   });

//   it("Created an Identity from original owner address", async function() {
//     const metadata = "Helllooo!!!";
//     const { logs } = await this.identityFactory.createIdentity(
//       sender,
//       metadata,
//       { from: sender }
//     );
//     expectEvent.inLogs(logs, "identityCreated", {
//       owner: sender,
//       metadata: metadata
//     });
//   });
// });

// contract("Identity", ([sender, receiver, thirdperson, fourthperson]) => {
//   const metadata = "Helllooo!!!";
//   let identityAddress = null;
//   this.identity = null;
//   this.registeredOwner = null;

//   beforeEach(async function() {
//     this.multiSigWalletFactory = await MultiSigWalletFactory.new();
//     this.identityFactory = await IdentityFactory.new();

//     await this.identityFactory.initialize(this.multiSigWalletFactory.address, {
//       from: sender
//     });

//     const { logs } = await this.identityFactory.createIdentity(
//       sender,
//       metadata,
//       { from: sender }
//     );

//     identityAddress = logs[0].args.identityAddress;
//     registeredOwner = logs[0].args.owner;

//     this.identity = await Identity.at(identityAddress);
//     console.log(`The sender: ${sender} the owner: ${registeredOwner}`);
//   });

//   it("Expect the identity to belong to sender", async function() {
//     const metadata = "Helllooo!!!";
//     const owner = await this.identity.owner();

//     expect(owner).to.be.equal(sender);
//   });

//   it("Add additional Address to White list", async function () {
//     const {logs} = await this.identity.addWhitelistAdmin(thirdperson, {from: sender});
//     expectEvent.inLogs(logs, "WhitelistAdminAdded", {
//       account: thirdperson
//     });
//   })

//   it("Should not allow unauthorized person to add to whitelist", async function () {
//     await expectRevert(this.identity.addWhitelistAdmin(fourthperson, {from: receiver}), "The message sender is not an admin");
//   })

// });

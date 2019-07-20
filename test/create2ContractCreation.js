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

contract.skip(
  "Identity: Create2",
  ([sender, receiver, thirdperson, fourthperson]) => {
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

      await this.identityFactory.initialize(
        this.multiSigWalletFactory.address,
        {
          from: sender
        }
      );

      const { logs } = await this.identityFactory.createIdentity(
        sender,
        "Hello Metadata",
        { from: sender }
      );

      identityAddress = logs[0].args.identityAddress;
      registeredOwner = logs[0].args.owner;

      identity = await Identity.at(identityAddress);
    });

    it("Deployed a create2 contract", async () => {
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

    it("Should not deploy a create2 contract if the sender is not whitelisted", async () => {
      const { abi: accountAbi, bytecode: accountBytecode } = AccountContract;

      let salt = 1;

      const create2CalculatedAddress = buildCreate2Address(
        identityAddress,
        numberToUint256(salt),
        accountBytecode
      );

      await expectRevert(
        identity.execute(2, sender, 0, accountBytecode, salt, {
          from: thirdperson
        }),
        "The message sender is not an admin"
      );
    });

    it("It can deploy a create2 contract and call a function on it", async () => {
      const { abi: accountAbi, bytecode: accountBytecode } = AccountContract;
      let accountContract;
      let salt = 1;

      function getEncodedCall(instance, method, params = []) {
        const contract = new web3.eth.Contract(instance.abi);
        return contract.methods[method](...params).encodeABI();
      }

      const encodeParam = (dataType, data) => {
        return web3.eth.abi.encodeParameter(dataType, data);
      };

      
      const bytecode = `${accountBytecode}${encodeParam(
        "address",
        sender
      ).slice(2)}`;

      let { logs } = await identity.execute(2, sender, 0, bytecode, salt, {
        from: sender
      });

      const { contractAddress } = logs;

      const newcontractAddress = logs[0].args.contractAddress;

      accountContract = await AccountContract.at(newcontractAddress);

      const encodedCall = getEncodedCall(accountContract, "setOwner", [
        receiver
      ]);

      const result = await identity.execute(
        0,
        accountContract.address,
        0,
        encodedCall,
        0,
        { from: sender }
      );

      expectEvent.inLogs(result.logs, "callExecuted", {
        success: true
      });
    });
  }
);

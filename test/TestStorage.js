// Import all required modules from openzeppelin-test-helpers
const { BN, constants, expectEvent, expectRevert } = require('openzeppelin-test-helpers');

// Import preferred chai flavor: both expect and should are supported
const { expect } = require('chai');


const IdentityFactory = artifacts.require("IdentityFactory");
const MultiSigWalletFactory = artifacts.require("MultiSigWalletFactory");

// const identityFactory = require("../build/contracts/IdentityFactory.json");
// const multiSigWalletFactory = require("../build/contracts/MultiSigWalletFactory.json");

contract('MultiSigWalletFactory', ([sender,receiver])=> {
  beforeEach(async function (){
    this.multiSigWalletFactory = await MultiSigWalletFactory.new();
    this.identityFactory = await IdentityFactory.new();
  })

  it('initialized the IdentityFacotry', async function(){
    const tx = await this.identityFactory.initialize('0x680f515538D98a271Fd9746412FA63a55107C178', {from: sender})
    console.log(tx);
    expect(tx).to.be.true;
  })
})


// const assert = require("assert");
// //const ganache = require("ganache-cli");
// const Web3 = require("web3");
// const web3 = new Web3('ws://localhost:8545');

// const idFactoryInterface = identityFactory["abi"];
// const idFactoryBytecode = identityFactory["bytescode"];

// const multiSigInterface = multiSigWalletFactory["abi"];
// const multiSigBytecode = multiSigWalletFactory["bytecode"];

// let accounts = null;
// let multiSig = null;
// let idFactory = null;

// // beforeEach(async () => {
// //   accounts = await web3.eth.getAccounts();
// //   owner = accounts[0];

// //   multiSig = await new web3.eth.Contract(multiSigInterface)
// //     .deploy({ data: multiSigBytecode })
// //     .send({ from: owner, gas: "5000000" });

// //     console.log("This is multiSig: ", multiSig);

// //   idFactory = await new web3.eth.Contract(idFactoryInterface)
// //     .deploy({ data: idFactoryBytecode })
// //     .send({ from: owner, gas: "5000000" });
// // });

// // describe('Id factory', () => {
// //   it('Initialized the Id Factory', async (done) => {
// //     const tx = await idFactory.methods.initialize(multiSig.address).send({from: owner});
// //     console.log(tx);
// //     expect(1).to.equal(1);
// //     done();
// //   })

// // })

// const app = async () => {
//   accounts = await web3.eth.getAccounts();

//   owner = accounts[0];
//   multiSig = await new web3.eth.Contract(multiSigWalletFactory)
//   .deploy({ data: multiSigBytecode })
//   .send({ from: owner, gas: "6000000" });

//   console.log("This is multiSig: ", multiSig);
// }

// app();
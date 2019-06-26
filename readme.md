# Identity: 

When using Ethereum, we primarilly think of our walllet as being our public-private keypair. This is how we normally interact on the blockchain, we sign transactions with our private key. This has a number of drawbacks- users need to be extremely careful with their keys, there is no backup incase of loss, and when users are indentified by their public key- losing the corresponding private key means losing ones identity completely. 

## The idea: 

The idea behind Identity is to create a contract which can represent a user, an organization, an agent, anything- but rather than have this identity be tied to a singular key pair, it can be tied to a contract which can exceute arbitrary code, and thus interact like a first-class citizen on Ethereum. 

When thinking about Identiy the following things were part of the wish list: 

1. Meta transaction support: this means users can start using ethereum without haveing ethereum, and without having a wallet, nor owning any ETH for gas. 

2. First Class citizen: users can send transactions and create contracts, including using the new `create2` opcode.

3. Social Recovery: users can create multi-sigs collections of keypairs that are allowed to regain access to their account. 

4. Permission system: users can allow multiple addreses, or via multi-sig, groups of addresses to control the wallet. This means DApp developers can implement features such as 2FA for transactions. 

5. Arbitrary Metadata: Identities should be able to pin meta-data to themselves. This might be encrypted personal records in the case of individuals, it might be public finacial statements in the case of a non-profit. If the indetity is supposed to represent an agent, there should be the ability to attach additional metadata. 

6. Standards compliant: An identity should play nice with other existing standards in Ethereum.

# How do we do it? 

Identity is system for deploying ideneity contracts based on ERC725, that can execute arbitrary code, deploy contracts (Both create and create2), supports MetaTransactions via the Gas Stations network, Arbitray MetaData can be assigned to the Identity, Multiple authorized users, and Social recovery (or multisignature) via Gnosis Multisig. 

When an Identity is created, this identity can be used to own ETH, Tokens, and represent a user, organization or individual on Ethereum, with all the power that a typical user would normally have, but with a number of additional advatages. 

_ERC725_: Being ERC725 compatible means that it conforms to the specification. 

_ZeppelinOS_: The identity factory and MultiSigWallet factories are upgradable by nature, meaning they can make newer types of identities or factories. Currently these factories create non-upgradable contracts, so for the moment the contracts they create are immutable. 

_MetaTransactions_: unlike a normal wallet on Ethereum, users can now execute any transaction without needing to own or hold ETH.

_Social Recovery_: Each identity can create a social recovery multisig using Gnosis wallet that allows for a predetermined number of signatures to regain control over the identity wallet in the case the Owner looses their private key.

_MultiSign_: Using Gnosis multisig commands can require either mupltiple parties, or multiple devices to sign off on transactions. This means an action taken on the desktop can be confirmed on mobile. 

_OpenZeppelin Roles_: Used to manage who can acces functions in a way that is already known to be secure. 

_OpenZeppelin-Test-helpers_: Used to dramatically simplify the testing process. 

__MetaData_: Arbitrary metadata can be associated with the Identity account. This means that Identities can attach documentation, ID's, medical records, personal schedules of assets, etc... to identities. A museum for example, could create an Identity that represents itself, along with MetaData that represents their collection. 

# Why: 

In a number of my own personal and profesional projects I have discovered the need for an "identity" on the blockchian that can own tokens, make contract calls, represent not just an inidividual but also an organization. Additionally, user onboarding continues to be a pain and MetaTxns works to solve this. This project is a collection of useful opensource technologies already availible, to build something that fit my, and hopefully others, needs. 

Ideally I would like to build a Nodejs library that allows users to use Identities without needing to go through the process of building transactions, understanding function signatures, etc...

# Get Started: 

*Identity* is built using [ZeppelinOS](https://zeppelinos.org/). This gives the flexibility for building in upgradable contracts and in the future, creating [EVM packages](https://docs.zeppelinos.org/docs/publishing.html) of the resulting code. This means significant gas savings for deployment and the option for users to accept (or reject) upgradable instances. 

## To start, install ZeppelinOS. You will prefer version 2.4 and higher.

`npm install -g zos`

## Clone this project and cd into it. 

`cd IdentityContract`

## Run NPM install

`npm install`

## Run a local development blockchain

`npm install -g ganache-cli`

`ganache-cli --deterministic`

## First create an instance of the Gnosis `MultiSigWalletFactory.sol`

`zos create MultiSigWalletFactory`

Take note of the address the `zos` cli returns, you will need this for the next step. 
You are free to use any MultiSigWalletFactory as long as it conforms to the _Gnosis_ contract interface. 

## Create an instance of the `IdentityFactory.sol` contract

`zos create IdentityFactory`

Follow the cli prompts. It will ask you if you want to run a function, select yes, 
then select `initialize()` as the function you wish to run. Pass the address of the 
previously created `MultiSigWalletFactory` as the arguement. 

## Your Identity factory is now ready. To create an identity: 

`zos send-tx`

This will prompt you to select the function you want to send a transaction to. 

Select, `createIdentity(address _initialOwner, string calldata _metadata)` and pass
the address of the identities initial owner and a string for the metadata. 

Success! You now have a first-class citizen Identity contract!

(I will update with more tutorial soon)


## To Test:

First start up an instance of Ganache:

`ganache-cli`

then run your tests: 

`truffle test`

## Notes: 

This project is MIT licensed. Open source for the win!

I am currently looking for individuals to participate in growing this project as well as funding to potentially hire developers as well. Please feel free to reach me either at: 

dennison@dennisonbertram.com



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

# What: 

Identity is system for deploying ideneity contracts based on ERC725, that can execute arbitrary code, deploy contracts (Both create and create2), supports MetaTransactions via the Gas Stations network, Arbitray MetaData can be assigned to the Identity, Multiple authorized users, and Social recovery (or multisignature) via Gnosis Multisig. 

When an Identity is created, this identity can be used to own ETH, Tokens, and represent a user, organization or individual on Ethereum, with all the power that a typical user would normally have, but with a number of additional advatages. 

ERC725: Being ERC725 compatible means that it conforms to the specification. 

ZeppelinOS: The identity factory and MultiSigWallet factories are upgradable by nature, meaning they can make newer types of identities or factories. Currently these factories create non-upgradable contracts, so for the moment the contracts they create are immutable. 

MetaTransactions: unlike a normal wallet on Ethereum, users can now execute any transaction without needing to own or hold ETH.

Social Recovery: Each identity can create a social recovery multisig using Gnosis wallet that allows for a predetermined number of signatures to regain control over the identity wallet in the case the Owner looses their private key.

MultiSign: Using Gnosis multisig commands can require either mupltiple parties, or multiple devices to sign off on transactions. This means an action taken on the desktop can be confirmed on mobile. 

OpenZeppelin Roles: Used to manage who can acces functions in a way that is already known to be secure. 

OpenZeppelin-Test-helpers: Used to dramatically simplify the testing process. 

MetaData: Arbitrary metadata can be associated with the Identity account. This means that Identities can attach documentation, ID's, medical records, personal schedules of assets, etc... to identities. A museum for example, could create an Identity that represents itself, along with MetaData that represents their collection. 

# Why: 

In a number of my own personal and profesional projects I have discovered the need for an "identity" on the blockchian that can own tokens, make contract calls, represent not just an inidividual but also an organization. Additionally, user onboarding continues to be a pain and MetaTxns works to solve this. This project is a collection of useful opensource technologies already availible, to build something that fit my, and hopefully others, needs. 

Future: 

This is not production ready code. Not. At. All. But it's ready to experiment. 

In the future, I would imagine adding additional features. For now, I am looking to make more comprehensive tests and then I would like to start using it in other projects. 

Ideally I would like to build a Nodejs library that allows users to use Identities without needing to go through the process of building transactions, understanding function signatures, etc...

# To Test:

First start up an instance of Ganache:

`ganache-cli`

then run your tests: 

`truffle test`

# To run: 

`zos push`

`zos create MultiSigWalletFactory`

Save the address this returns, it is needed to initialize the Identity Factory.

`zos create IdentityFactory`

Follow the prompts, when it asks you if you want to call a function select yes, and choose the `initialize` function. Pass the address of the `MultiSigWalletFactory` as the argument. 

Your Identity factory should now be ready, to create an identity you need to send-tx to: `createIdentity(address _initialOwner, string calldata _metadata)` passing the address of the `_initialOwner` and `_metadata` for the identity. 

The scripts in the `test` folder can give more ideas how to interact with created identity. 






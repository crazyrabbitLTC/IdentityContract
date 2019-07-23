export default class Identity {
  constructor(web3, accounts, identityInstance, identityFactoryInstance) {
    this.web3 = web3;
    this.identity = identityInstance;
    this.idFactory = identityFactoryInstance;
    this.accounts = accounts;
  }

  getEncodedCall(artifact, method, params = []) {
    const contract = new this.web3.eth.Contract(artifact.abi);
    return contract.methods[method](...params).encodeABI();
  }

  encodeParam = (dataType, data) => {
    return this.web3.eth.abi.encodeParameter(dataType, data);
  };

  async createIdentity(dataObject, identityFactoryInstance = this.idFactory) {
    const data = JSON.stringify(dataObject);
    const factory = this.idFactory.methods;

    let tx = null;

    try {
      tx = await factory
        .createIdentity(this.accounts[0], data)
        .send({ from: this.accounts[0] });
    } catch (error) {
      console.log("Create Identity Failed, error was: ", error);
    }

    let {
      identityAddress,
      owner,
      identityId,
      metadata
    } = tx.events.identityCreated.returnValues;

    return { identityAddress, owner, identityId, metadata };
  }

  getCreate2Address(creatorAddress, saltHex, byteCode) {
    return `0x${this.web3.utils
      .sha3(
        `0x${["ff", creatorAddress, saltHex, this.web3.utils.sha3(byteCode)]
          .map(x => x.toString().replace(/0x/, ""))
          .join("")}`
      )
      .slice(-40)}`.toLowerCase();
  }

  numberToUint256(value) {
    const hex = value.toString(16);
    return `0x${"0".repeat(64 - hex.length)}${hex}`;
  }

  async addMetadata(metadata) {
    const identity = this.identity.methods;
    const data = JSON.stringify(metadata);
    let tx = null;

    try {
      tx = await identity.addIdMetadata(data).send({ from: this.accounts[0] });
      console.log(tx.events.metadataAdded.returnValues.metadata);
    } catch (error) {
      console.log(error);
    }
  }

  async getTotalMetadata() {
    const identity = this.identity.methods;
    let count;
    try {
      count = await identity.getTotalMetadata().call();
    } catch (error) {
      console.log(error);
    }
    console.log("Meta Data Count is: ", count);
    return count;
  }

  async getSingleMetadata(id) {
    const identity = this.identity.methods;
    let metadata;

    try {
      metadata = await identity.getSingleIdMetaData(id).call();
    } catch (error) {
      console.log(error);
    }
    metadata = JSON.parse(metadata);
    console.log("The Metadata is: ", metadata);
    return metadata;
  }

  async sendEth(value, to) {
    //validate the to is a valid address and not a 0x0 address
    const identity = this.identity.methods;

    value = this.web3.utils.toWei(value, "ether");
    console.log("Value sent is: ", value);
    let tx;

    try {
      tx = await identity.sendEth(to, value).send({ from: this.accounts[0] });
      console.log("EVENT: ", tx.events.EthSent.returnValues);
    } catch (error) {
      console.log(error);
    }
    return tx;
  }

  async getIdentityBalance() {
    let balance;

    try {
      balance = await this.web3.eth.getBalance(this.identity._address); //Will give value in.
      balance = this.web3.utils.fromWei(balance, "ether");
    } catch (error) {
      console.log(error);
    }

    console.log("The balance is: ", balance);
    return balance;
  }

  putIdentityOnLocalStorage(address, artifact, metadata) {
    let storedObject = {
      address,
      artifact,
      metadata
    };
    window.localStorage.setItem("userIdentity", JSON.stringify(storedObject));
  }

  clearIdentityFromLocalStorage() {
    window.localStorage.removeItem("userIdentity");
    console.log("Identity Cleared from Local Storage");
  }

  async deployContract(accountBytecode, parens) {
    const identity = this.identity.methods;
    const accounts = this.accounts;
    let tx;

    const bytecode = `${accountBytecode}${this.encodeParam(
      "address",
      "0x262d41499c802decd532fd65d991e477a068e132"
    ).slice(2)}`;

    try {
      console.log("The Accounts: ", accounts);
      tx = await identity
        .execute(1, accounts[0], 0, bytecode, 0)
        .send({ from: accounts[0] });
      console.log("Full transactions: ", tx);
      console.log("EVENT: ", tx.events.contractCreated.returnValues);
    } catch (error) {
      console.log(error);
    }

    return tx;
  }

  async executeCall(
    destinationAbi,
    destinationAddress,
    method,
    params,
  ) {
    const identity = this.identity.methods;

    const encodedCall = this.getEncodedCall(destinationAbi, method, params);

    let result;

    try {
      result = await identity
        .execute(0, destinationAddress, 0, encodedCall, 0)
        .send({
          from: this.accounts[0]
        });
      console.log("The Execute call result is: ", result);
    } catch (error) {
      console.log(error);
    }

    return result;
  }
}
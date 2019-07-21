const getEncodedCall = (web3, artifact, method, params = []) => {
  const contract = new web3.eth.Contract(artifact.abi);
  return contract.methods[method](...params).encodeABI();
};

const encodeParam = (dataType, data) => {
  return this.web3.eth.abi.encodeParameter(dataType, data);
};

const createIdentity = async (dataObject, identityFactoryInstance, accounts) => {
  const data = JSON.stringify(dataObject);
  const factory = identityFactoryInstance.methods;

  let tx = null;

  try {
    tx = await factory
      .createIdentity(accounts[0], data)
      .send({ from: accounts[0] });
  } catch (error) {
    console.log("Create Identity Failed, error was: ", error);
  }

  let {
    identityAddress,
    owner,
    identityId,
    metadata
  } = tx.events.identityCreated.returnValues;

  return ({identityAddress, owner, identityId, metadata});
};

const getCreate2Address = (creatorAddress, saltHex, byteCode) => {
  return `0x${this.web3.utils
    .sha3(
      `0x${["ff", creatorAddress, saltHex, this.web3.utils.sha3(byteCode)]
        .map(x => x.toString().replace(/0x/, ""))
        .join("")}`
    )
    .slice(-40)}`.toLowerCase();
};

const numberToUint256 = value => {
  const hex = value.toString(16);
  return `0x${"0".repeat(64 - hex.length)}${hex}`;
};

const addMetadata = async (metadata, instance, accounts) => {
  const identity = instance.methods;
  const data = JSON.stringify(metadata);
  let tx = null;

  try {
    tx = await identity.addIdMetadata(data).send({ from: accounts[0] });
    console.log(tx.events.metadataAdded.returnValues.metadata);
  } catch (error) {
    console.log(error);
  }
};

const getTotalMetadata = async instance => {
  const identity = instance.methods;
  let count;
  try {
    count = await identity.getTotalMetadata().call();
  } catch (error) {
    console.log(error);
  }
  console.log("Meta Data Count is: ", count);
  return count;
};

const getSingleMetadata = async (id, instance) => {
  const identity = instance.methods;
  let metadata;

  try {
    metadata = await identity.getSingleIdMetaData(id).call();
  } catch (error) {
    console.log(error);
  }

  console.log("The Metadata is: ", metadata);
  return metadata;
};

const getIdentityBalance = async (web3, instance) => {
  let balance;

  try {
    balance = await web3.eth.getBalance(instance._address); //Will give value in.
    balance = web3.utils.fromWei(balance, "ether");
  } catch (error) {
    console.log(error);
  }

  console.log("The balance is: ", balance);
  return balance;
};

const sendEth = async (value, to, web3, instance, accounts) => {
  //validate the to is a valid address and not a 0x0 address
  const identity = instance.methods;

  value = web3.utils.toWei(value, "ether");
  console.log("Value sent is: ", value);
  let tx;

  try {
    tx = await identity.sendEth(to, value).send({ from: accounts[0] });
    console.log("EVENT: ", tx.events.EthSent.returnValues);
  } catch (error) {
    console.log(error);
  }
};

const putIdentityOnLocalStorage = (address, artifact, metadata) => {
  let storedObject = {
    address,
    artifact,
    metadata
  }
  window.localStorage.setItem('userIdentity', JSON.stringify(storedObject));
  console.log("The Stored Object is: ", storedObject);
  let result = window.localStorage.getItem('userIdentity');
  //console.log("What was really stored: ", result);
}

const clearIdentityFromLocalStorage = () => {
  window.localStorage.removeItem('userIdentity');
  console.log("Identity Cleared from Local Storage");
}

export {
  clearIdentityFromLocalStorage,
  putIdentityOnLocalStorage,
  createIdentity,
  sendEth,
  getIdentityBalance,
  getSingleMetadata,
  getTotalMetadata,
  addMetadata,
  getEncodedCall,
  encodeParam,
  getCreate2Address,
  numberToUint256
};

const loadIdentityTotal = async instance => {
  let total = null;
  try {
    total = await instance.identityCount().call();
  } catch (error) {
    console.log(error);
  }

  return total;
};

const isIdentityFactoryReady = async instance => {
  let ready = false;

  try {
    ready = await instance.contractInitialized().call();
  } catch (error) {
    console.log(error);
  }

  return ready;
};

const getIdentityById = async (id, instance) => {
  let identity = null;
  try {
    identity = await instance.identities(id).call();
  } catch (error) {
    console.log(error);
  }

  return identity;
};

const loadInstance = async (web3, artifact, address) => {
  let instance = null;
  try {
    instance = new web3.eth.Contract(artifact.abi, address);
  } catch (error) {
    console.log(error);
  }

  return instance;
};

export {
  loadIdentityTotal,
  isIdentityFactoryReady,
  getIdentityById,
  loadInstance
};

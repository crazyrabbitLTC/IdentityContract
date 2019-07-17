const loadIdentityTotal = async instance => {
  let total = null;
  console.log("The instance", instance);
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

const loadIdentity = async (address, web3, network, artfact) => {

    let identityInstance = null;

    

}

export { loadIdentityTotal, isIdentityFactoryReady, getIdentityById };

const loadInstance = async (web3, artifact, address) => {
    let instance = null;
    try {
      instance = new web3.eth.Contract(artifact.abi, address);
    } catch (error) {
      console.log(error);
    }
  
    return instance;
  };

  export {loadInstance};
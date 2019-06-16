import React, { useState, useEffect } from "react";
import { Button } from "rimble-ui";

const CreateUser = props => {
  const { network, contracts, appReady, setAppState } = props;
  const { instance, artifacts } = contracts;
  const { web3, accounts, networkId } = network;
  const { identityFactoryInstance, multiSigFactoryInstance } = instance;
  const factory = identityFactoryInstance.methods;
  const multiSigAddress =
    contracts.artifacts.MultiSigFactory.networks[networkId].address;
  console.log("MultiSigAddress", multiSigAddress);
  console.log(props);

  const defaultStatus = {fetching: false, identityId: null};
  const [status, setStatus] = useState(defaultStatus);

  useEffect(()=> {
    const subscription = web3.eth.subscribe('logs', {
        address: "0xD833215cBcc3f914bD1C9ece3EE7BF8B14f841bb",
        topics: ['identityCreated']
    }, function(error, result){
        if (!error)
            console.log("The Sub result", result);
    });
    // unsubscribes the subscription
    // subscription.unsubscribe(function(error, success){
    //     if(success)
    //         console.log('Successfully unsubscribed!');
    // });
  }, [])

  const createIdentity = async () => {
    // setAppState({
    //   ...props,
    //   fetchStatus: { loadingApp: false, txPending: true }
    // });
    setStatus({fetching: true});

    const tx = await factory
      .createIdentity(accounts[0], multiSigAddress)
      .send({ from: accounts[0] });
    console.log("TransactionHash: ", tx);

    setStatus({fetching: false});
  };

  const waitForTx = async () => {};
  return (
    <div>
      <Button size={"medium"} onClick={() => createIdentity()}>
        Click me!
      </Button>

    </div>
  );
};

export default CreateUser;

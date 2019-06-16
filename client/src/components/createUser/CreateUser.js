import React, { useState, useEffect } from "react";
import { Button } from "rimble-ui";

const CreateUser = props => {
  const { network, contracts, appReady, setAppState } = props;
  const { instance, artifacts } = contracts;
  const { web3, accounts, networkId } = network;
  const { identityFactoryInstance, multiSigFactoryInstance } = instance;
  const factory = identityFactoryInstance.methods;
  // const multiSigAddress =
  //   contracts.artifacts.MultiSigFactory.networks[networkId].address;
  // console.log("MultiSigAddress", multiSigAddress);
  console.log(props);

  const defaultStatus = {fetching: false, identityId: null, owner: null, identityAddress: null};
  const [status, setStatus] = useState(defaultStatus);

  const createIdentity = async () => {

    setStatus({fetching: true});

    const tx = await factory
      .createIdentity(accounts[0], "This is smetadata!")
      .send({ from: accounts[0] });
    console.log("TransactionHash: ", tx);
    let events = tx.events.identityCreated.returnValues;
    let {identityAddress, owner, identityId} = tx.events.identityCreated.returnValues;

    console.log(events);
    setStatus({fetching: false, identityAddress, owner, identityId});
  };

  return (
    <div> 
        <div>
           Identity Address: {status.address}  
           IdentityID: {status.identityId}  
           OWner: {status.owner} 
        </div>
      <Button size={"medium"} onClick={() => createIdentity()}>
        Click me!
      </Button>

    </div>
  );
};

export default CreateUser;

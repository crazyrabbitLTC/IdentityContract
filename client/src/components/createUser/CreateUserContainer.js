import React, { useState, useEffect } from "react";
import { Button } from "rimble-ui";
import UserForm from "./UserForm";

const CreateUserContainer = props => {
  const { network, contracts, appReady, setAppState } = props;
  const { instance, artifacts } = contracts;
  const { web3, accounts, networkId } = network;
  const { identityFactoryInstance, multiSigFactoryInstance } = instance;
  const factory = identityFactoryInstance.methods;

  // const multiSigAddress =
  //   contracts.artifacts.MultiSigFactory.networks[networkId].address;
  // console.log("MultiSigAddress", multiSigAddress);

  const defaultStatus = {
    fetching: false,
    identityId: null,
    owner: null,
    identityAddress: null,
    metadata: null
  };
  const [status, setStatus] = useState(defaultStatus);

  const createIdentity = async formData => {
    console.log("here");
    const data = JSON.stringify(formData);

    setStatus({ fetching: true });

    const tx = await factory
      .createIdentity(accounts[0], data)
      .send({ from: accounts[0] });
    console.log("TransactionHash: ", tx);
    let events = tx.events.identityCreated.returnValues;
    let {
      identityAddress,
      owner,
      identityId,
      metadata
    } = tx.events.identityCreated.returnValues;

    metadata = JSON.parse(metadata);

    console.log(events);
    setStatus({
      fetching: false,
      identityAddress,
      owner,
      identityId,
      metadata
    });
  };

  return (
    <div>
      {status.metadata ? (
        <div>
          Identity Address: {status.identityAddress}
          Name: {status.metadata.name} photo: {status.metadata.photo}
        </div>
      ) : (
        <div>Identity Address: none Name: none photo: none</div>
      )}

      <Button size={"medium"} onClick={() => createIdentity()}>
        Click me!
      </Button>
      <UserForm {...props} handleFormSubmit={createIdentity} />
    </div>
  );
};

export default CreateUserContainer;

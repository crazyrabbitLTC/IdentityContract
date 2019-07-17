import React, { useState } from "react";
import UserForm from "./UserForm";
import { loadInstance } from "../../utils/identityFactoryUtils";

const CreateUserContainer = props => {
  const { network, contracts } = props;
  const { web3 } = network;
  const { instance } = contracts;
  const identityArtifact = contracts.artifacts.Identity;
  const { accounts } = network;
  const { identityFactoryInstance } = instance;
  const factory = identityFactoryInstance.methods;

  const defaultStatus = {
    fetching: false,
    identityId: null,
    owner: null,
    identityAddress: null,
    identityInstance: null,
    metadata: null
  };
  const [status, setStatus] = useState(defaultStatus);

  const createIdentity = async formData => {
    const data = JSON.stringify(formData);

    setStatus({ fetching: true });

    let tx = null;

    try {
      tx = await factory
        .createIdentity(accounts[0], data)
        .send({ from: accounts[0] });
    } catch (error) {
      console.log("Create Identity Failed, error was: ", error);
    }

    let events = tx.events.identityCreated.returnValues;
    let {
      identityAddress,
      owner,
      identityId,
      metadata
    } = tx.events.identityCreated.returnValues;

    let identityInstance = null;
    try {
      identityInstance = await loadInstance(
        web3,
        identityArtifact,
        identityAddress
      );
    } catch (error) {
      console.log("Error loading Identity Instance");
      console.log(error);
    }

    metadata = JSON.parse(metadata);

    setStatus({
      fetching: false,
      identityAddress,
      owner,
      identityId,
      metadata,
      identityInstance
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

      {/* <Button size={"medium"} onClick={() => createIdentity()}>
        Click me!
      </Button> */}
      <UserForm {...props} handleFormSubmit={createIdentity} />
    </div>
  );
};

export default CreateUserContainer;

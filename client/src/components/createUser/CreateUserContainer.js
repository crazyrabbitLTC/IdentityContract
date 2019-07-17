import React, { useState } from "react";
import UserForm from "./UserForm";

const CreateUserContainer = props => {
  const { network, contracts } = props;
  const { instance } = contracts;
  const { accounts } = network;
  const { identityFactoryInstance } = instance;
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
    
    const data = JSON.stringify(formData);
    console.log("Form data is: ", data);
    setStatus({ fetching: true });

    let tx = null;
    console.log("ONE")
    try {
      tx = await factory
      .createIdentity(accounts[0], data)
      .send({ from: accounts[0] });
    } catch (error) {
      console.log("Create Identity Failed, error was: ", error);
    }
    console.log("two")
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

      {/* <Button size={"medium"} onClick={() => createIdentity()}>
        Click me!
      </Button> */}
      <UserForm {...props} handleFormSubmit={createIdentity} />
    </div>
  );
};

export default CreateUserContainer;

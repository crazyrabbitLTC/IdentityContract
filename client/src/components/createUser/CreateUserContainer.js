import React, { useState } from "react";
import UserForm from "./UserForm";
import { loadInstance } from "../../utils/identityFactoryUtils";
import { Button } from "rimble-ui";

const CreateUserContainer = props => {
  const { network, contracts, setIdentityOnState } = props;
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

  

  const addMetaData = async metadata => {
    const identity = status.identityInstance.methods;
    const data = JSON.stringify(metadata);

    console.log("Component Status before Fetch: ", status);
    setStatus({fetching: true});
    

    let tx = null;

    try {
      tx = await identity.addIdMetadata(data).send({from: accounts[0]});
      console.log(tx.events.metadataAdded.returnValues.metadata);
    } catch (error) {
      console.log(error)
    }

    console.log("Component Status after Fetch: ", status);
    setStatus({fetching: false});

  }

  const getTotalMetadata = async () => {
    const identity = status.identityInstance.methods;
    let count;

    try {
      count = await identity.getTotalMetadata().call();
    } catch (error) {
      console.log(error);
    }

    console.log("Meta Data Count is: ", count);
    return count;
  }

  const getSingleMetadata = async (id) => {
    const identity = status.identityInstance.methods;
    let metadata;

    try {
      metadata = await identity.getSingleIdMetaData(id).call();     
    } catch (error) {
      console.log(error);
    }

    console.log("The Metadata is: ", metadata);
    return metadata;
  }


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
      {status.identityInstance ? (
        <div>
          Identity Address: {status.identityAddress}
          Name: {status.metadata.name} photo: {status.metadata.photo}
          <Button onClick={()=> addMetaData({test: "This is metadata"})}>Add metadata: </Button>
          <Button onClick={()=> getTotalMetadata()}>Get Metadata in console</Button>
          <Button onClick={()=> getSingleMetadata(0)}>Get First Metadata</Button>
        </div>
      ) : (
        <div>Create a New Identity</div>
      )}

      {status.identityInstance ? (
        <div><div>Identity Created</div>
       </div>
      ) : (
        <UserForm {...props} handleFormSubmit={createIdentity} />
      )}
    </div>
  );
};

export default CreateUserContainer;

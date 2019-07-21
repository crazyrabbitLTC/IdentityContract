import React, { useState } from "react";
import UserForm from "./UserForm";
import { loadInstance } from "../../utils/identityFactoryUtils";
import { Button } from "rimble-ui";
import {
  addMetadata,
  getTotalMetadata,
  getSingleMetadata,
  getIdentityBalance,
  sendEth
} from "../../utils/identityUtils";

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
    console.log("The Identity: ", identityInstance._address);

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
          <Button
            onClick={() =>
              addMetadata(
                { test: "This is metadata" },
                status.identityInstance,
                accounts
              )
            }
          >
            Add metadata:{" "}
          </Button>
          <Button onClick={() => getTotalMetadata(status.identityInstance)}>
            Get Metadata in console
          </Button>
          <Button onClick={() => getSingleMetadata(0, status.identityInstance)}>
            Get First Metadata
          </Button>
          <Button
            onClick={() => getIdentityBalance(web3, status.identityInstance)}
          >
            Get Balance
          </Button>
          <Button
            onClick={() =>
              sendEth("0.5", "0x680f515538D98a271Fd9746412FA63a55107C178", web3, status.identityInstance, accounts)
            }
          >
            Send Eth
          </Button>
        </div>
      ) : (
        <div>Create a New Identity</div>
      )}

      {status.identityInstance ? (
        <div>
          <div>Identity Created</div>
        </div>
      ) : (
        <UserForm {...props} handleFormSubmit={createIdentity} />
      )}
    </div>
  );
};

export default CreateUserContainer;

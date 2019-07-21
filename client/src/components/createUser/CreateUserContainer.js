import React, { useState } from "react";
import UserForm from "./UserForm";
import { loadInstance } from "../../utils/identityFactoryUtils";
import { Button } from "rimble-ui";
import {
  addMetadata,
  getTotalMetadata,
  getSingleMetadata,
  getIdentityBalance,
  sendEth,
  createIdentity
} from "../../utils/identityUtils";

const CreateUserContainer = props => {
  const { network, contracts } = props;
  const { web3 } = network;
  const { instance } = contracts;
  const identityArtifact = contracts.artifacts.Identity;
  const { accounts } = network;
  const { identityFactoryInstance } = instance;

  const defaultStatus = {
    fetching: false,
    identityId: null,
    owner: null,
    identityAddress: null,
    identityInstance: null,
    metadata: null
  };
  const [status, setStatus] = useState(defaultStatus);

  const createIdentity2 = async (formData) => {
    let { identityAddress, owner, identityId, metadata } = await createIdentity(
      formData,
      identityFactoryInstance,
      accounts
    );

    let identityInstance;

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

    let metadata2 = JSON.parse(metadata);
    console.log("The Identity: ", identityInstance._address);

    setStatus({
      fetching: false,
      identityAddress,
      owner,
      identityId,
      metadata: metadata2,
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
              sendEth(
                "0.5",
                "0x680f515538D98a271Fd9746412FA63a55107C178",
                web3,
                status.identityInstance,
                accounts
              )
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
        <UserForm {...props} handleFormSubmit={createIdentity2} />
      )}
    </div>
  );
};

export default CreateUserContainer;

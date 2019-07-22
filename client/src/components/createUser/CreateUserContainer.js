import React, { useState, useEffect } from "react";
import UserForm from "./UserForm";
import { loadInstance } from "../../utils/utils";
import { Button } from "rimble-ui";
import {
  executeCall,
  addMetadata,
  getTotalMetadata,
  getSingleMetadata,
  getIdentityBalance,
  sendEth,
  createIdentity,
  putIdentityOnLocalStorage,
  clearIdentityFromLocalStorage,
  deployContract
} from "../../utils/identityUtils";

const accountContract = require("../../../../contracts/Account.sol");

console.log("Here is Account Contract", accountContract);

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

  useEffect(() => {
    const load = async () => {
      if (instance.identityInstance) {
        const total = await getTotalMetadata(instance.identityInstance);
        const metadata = await getSingleMetadata(0, instance.identityInstance);
        const balance = await getIdentityBalance(
          web3,
          instance.identityInstance
        );
        metadata.total = total;
        metadata.balance = balance;

        console.log("The metadata is: ", metadata);
        setStatus({ identityInstance: instance.identityInstance, metadata });
      }
    };

    load();
    console.log("Instance put on local state");
  }, []);

  const mintIdentity = async formData => {
    let { identityAddress, owner, identityId, metadata } = await createIdentity(
      formData,
      identityFactoryInstance,
      accounts
    );

    let identityInstance = await loadInstance(
      web3,
      identityArtifact,
      identityAddress
    );

    let parsedMetadata = JSON.parse(metadata);
    console.log("The Identity: ", identityInstance._address);

    putIdentityOnLocalStorage(identityAddress, identityArtifact, metadata);

    setStatus({
      fetching: false,
      identityAddress,
      owner,
      identityId,
      metadata: parsedMetadata,
      identityInstance
    });
  };

  return (
    <div>
      {status.identityInstance ? (
        <div>
          Identity Address: {status.identityInstance._address}
          Name: {status.metadata.name} photo: {status.metadata.photo}
          Total Entries: {status.metadata.total} Balance:{" "}
          {status.metadata.balance}
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
          <Button onClick={() => clearIdentityFromLocalStorage()}>
            Clear Local Storage
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
          <Button
            onClick={() =>
              executeCall(
                web3,
                status.identityInstance,
                accountContract.abi,
                "0x680f515538D98a271Fd9746412FA63a55107C178",
                "setOwner",
                accounts,
                accounts
              )
            }
          >
            Make Remote Call
          </Button>
          <Button onClick={() => deployContract(web3, status.identityInstance, accountContract.bytecode, accounts)}>
            Deploy Contract
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
        <UserForm {...props} handleFormSubmit={mintIdentity} />
      )}
    </div>
  );
};

export default CreateUserContainer;

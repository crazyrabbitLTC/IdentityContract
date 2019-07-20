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
    console.log("Identity methods: ", identity);
    const data = JSON.stringify(metadata);

    console.log("Component Status before Fetch: ", status);
    
    

    let tx = null;

    try {
      tx = await identity.addIdMetadata(data).send({from: accounts[0]});
      console.log(tx.events.metadataAdded.returnValues.metadata);
    } catch (error) {
      console.log(error)
    }

    console.log("Component Status after Fetch: ", status);
    
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

  const getIdentityBalance = async (/*web3*/) => {
    
    let balance;

    try {
      balance = await web3.eth.getBalance(status.identityInstance._address); //Will give value in.
      balance = web3.utils.fromWei(balance, 'ether');
    } catch (error) {
      console.log(error);
    }

    console.log("The balance is: ", balance);
    return balance;
  }

  const sendEth = async (value, to) => {
    //validate the to is a valid address and not a 0x0 address
    const identity = status.identityInstance.methods;

    value = web3.utils.toWei(value, "ether");
    let tx;

    try {
      tx = await identity.sendEth(value, to).send({from: accounts[0]});
      console.log("EVENT: ", tx.events.EthSent.returnValues);
    } catch (error) {
      console.log(error);
    }
    
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
          <Button onClick={()=> addMetaData({test: "This is metadata"})}>Add metadata: </Button>
          <Button onClick={()=> getTotalMetadata()}>Get Metadata in console</Button>
          <Button onClick={()=> getSingleMetadata(0)}>Get First Metadata</Button>
          <Button onClick={()=> getIdentityBalance()}>Get Balance</Button>
          <Button onClick={()=> sendEth("0.5", "0x680f515538D98a271Fd9746412FA63a55107C178")}>Send Eth</Button>
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

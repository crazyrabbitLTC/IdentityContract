import React, { Component } from "react";
import getWeb3, { getGanacheWeb3 } from "./utils/getWeb3";
import Web3Info from "./components/Web3Info/index.js";
import { Loader } from "rimble-ui";

import styles from "./App.module.scss";

class App extends Component {
  state = {
    network: {
      web3: null,
      accounts: null,
      networkType: null,
      networkId: null,
      providerType: null
    },
    localNetwork: { web3: null, accounts: null },
    frontEnd: { route: window.location.pathname.replace("/", "") },
    contracts: { artifacts: {}, instance: {} },
    subscriptions: null,
    error: { status: false, message: null },
    fetchStatus: {loadApp: true}
  };

  getGanacheAddresses = async () => {
    if (!this.ganacheProvider) {
      this.ganacheProvider = getGanacheWeb3();
    }
    if (this.ganacheProvider) {
      return await this.ganacheProvider.eth.getAccounts();
    }
    return [];
  };

  componentDidMount = async () => {
    console.log(1)
    const network = await this.loadNetwork();
    console.log(2)
    const localNetwork = await this.loadDevNetwork();
    console.log(3)
    const artifacts = await this.loadArtifacts();
    console.log(4)
    const instance = await this.loadContractInstances(artifacts, network);
    
    const contracts = {artifacts, instance};

    this.setState({network, localNetwork, contracts, fetchStatus: {loadApp: false}});
  };

  loadArtifacts = async () => {
    let Identity = {};
    let MultiSigFactory = {};
    let MultiSigWallet = {};

    try {
      Identity = require("../../contracts/Identity.sol");
      MultiSigFactory = require("../../contracts/GnosisMultiSig/MultiSigWalletFactory.sol");
      MultiSigWallet = require("../../contracts/GnosisMultiSig/MultiSigWallet.sol");

      let artifacts = { Identity, MultiSigFactory, MultiSigWallet };

      return artifacts;
    } catch (e) {
      console.log(e);
      let error = { status: true, message: e };
      this.setState({ error });
    }
  };

  loadNetwork = async () => {
    let web3 = null;
    let accounts = null;
    let networkId = null;
    let networkType = null;
    let providerType = null;

    try {
      web3 = await getWeb3();
      accounts = await web3.eth.getAccounts();
      networkId = await web3.eth.net.getId();
      networkType = await web3.eth.net.getNetworkType();
      providerType = web3.currentProvider.isMetaMask;

      return { web3, accounts, networkType, networkId, providerType };
    } catch (e) {
      console.log(e);
      let error = { status: true, message: e };
      this.setState({ error });
    }
  };

  loadDevNetwork = async () => {
    let web3 = null;
    let accounts = null;
    try {
      web3 = await getGanacheWeb3();
      accounts = await this.getGanacheAddresses();
      let localWeb3 = { web3, accounts };
      return localWeb3;
    } catch (e) {
      console.log(e);
      let error = { status: true, message: e };
      this.setState({ error });
    }
  };

  loadContractInstances = async (artifacts, network) => {
    const { Identity, MultiSigFactory, MultiSigWallet } = artifacts;
    const { web3, networkId } = network;

    let identityInstance = {};
    let multiSigFactoryInstance = {};
    let multiSigWalletInstance = {};

    try {
      if (Identity.networks) {
        let deployedNetwork = null;
        deployedNetwork = Identity.networks[networkId.toString()];

        if (deployedNetwork) {
          identityInstance = new web3.eth.Contract(
            Identity.abi,
            deployedNetwork && deployedNetwork.address
          );
        }
      }

      if (MultiSigFactory.networks) {
        let deployedNetwork = null;
        deployedNetwork = MultiSigFactory.networks[networkId.toString()];

        if (deployedNetwork) {
          multiSigFactoryInstance = new web3.eth.Contract(
            MultiSigFactory.abi,
            deployedNetwork && deployedNetwork.address
          );
        }
      }

      if (MultiSigWallet.networks) {
        let deployedNetwork = null;
        deployedNetwork = MultiSigWallet.networks[networkId.toString()];

        if (deployedNetwork) {
          multiSigWalletInstance = new web3.eth.Contract(
            MultiSigWallet.abi,
            deployedNetwork && deployedNetwork.address
          );
        }
      }

      const instance = {identityInstance, multiSigFactoryInstance,multiSigWalletInstance};
      return instance;
    } catch (e) {
      console.log(e);
      let error = { status: true, message: e };
      this.setState({ error });
    }

  };

  componentWillUnmount() {

  }

  renderLoader() {
    return (
      <div className={styles.loader}>
        <Loader size="80px" color="red" />
        <h3> Loading Web3, accounts, and contract...</h3>
        <p> Unlock your metamask </p>
      </div>
    );
  }

  render() {
    if (!this.state.network.web3) {
      return this.renderLoader();
    }
    return (
      <div className={styles.App}>
        <h1>Good to Go!</h1>
        <p>Zepkit has created your app.</p>
        <h2>See your web3 info below:</h2>

      </div>
    );
  }
}

export default App;

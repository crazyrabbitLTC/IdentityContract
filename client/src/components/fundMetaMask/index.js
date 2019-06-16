import React, { Component } from "react";
import { Button } from "rimble-ui";

export default class FundMetaMask extends Component {
  fund = async () => {
    const { localNetwork, network } = this.props;
    await localNetwork.web3.eth.sendTransaction({
      from: localNetwork.accounts[0],
      to: network.accounts[0],
      value: 2e18
    });
  };

  render() {
    return (
      <div>
        <Button size="small" onClick={() => this.fund()}>
          Fund Meta Mask
        </Button>
      </div>
    );
  }
}

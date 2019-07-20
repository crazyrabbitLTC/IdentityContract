import React, { useState } from "react";

const IdentityContainer = props => {
    const { network, contracts } = props;
    const { web3 } = network;
    const { instance } = contracts;
    const identityArtifact = contracts.artifacts.Identity;
    const { accounts } = network;
    const { identityInstance } = instance;
    const identity = identityInstance.methods;

    const defaultState = {
        first: null,
    }

    const [state, setState] = useState(defaultState);

    return (
        <div>This is the identity container</div>
    )

}

export default IdentityContainer;
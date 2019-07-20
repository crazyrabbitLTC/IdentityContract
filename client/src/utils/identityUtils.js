const getEncodedCall = (web3, artifact, method, params = []) => {
  const contract = new web3.eth.Contract(artifact.abi);
  return contract.methods[method](...params).encodeABI();
};

const encodeParam = (dataType, data) => {
  return this.web3.eth.abi.encodeParameter(dataType, data);
};

const getCreate2Address = (creatorAddress, saltHex, byteCode) => {
  return `0x${this.web3.utils
    .sha3(
      `0x${["ff", creatorAddress, saltHex, this.web3.utils.sha3(byteCode)]
        .map(x => x.toString().replace(/0x/, ""))
        .join("")}`
    )
    .slice(-40)}`.toLowerCase();
};

const numberToUint256 = value => {
  const hex = value.toString(16);
  return `0x${"0".repeat(64 - hex.length)}${hex}`;
};

module.exports = {getEncodedCall, encodeParam, getCreate2Address, numberToUint256}
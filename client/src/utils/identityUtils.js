class Identity {
  constructor(instance) {
    this.instance = instance;
  }

  async changeOwner(newOwnerAddress, accounts) {
    //This function should change the owner of an Identity
    //If they are permitted
    let tx = null;
    let events = null;

    try {
      tx = await this.instance
        .changeOwner(newOwnerAddress)
        .send({ from: accounts[0] });
      events = tx.events.OwnerChanged.returnValues;
    } catch (error) {
      console.log(error);
    }
    return events;
  }

  async getKeyData(key) {

    let data = null;

    try {
        data = await this.instance.getData(key).call();
    } catch (error) {
        console.log(error);
    }
    return data;
  }

  async setKeyData(key, data, accounts) {
    let tx = null;
    let events = null;
    try {
        tx = await this.instance.setData(key, data).send({ from: accounts[0]});
        events = tx.events.DataChanged.returnValues;

    } catch (error) {
        console.log(error);
    }
    return events;
  }

  async getTotalMetadata(){
      let data = null;
      try {
          data = await this.instance.getTotalMetadata().call();
      } catch (error) {
          console.log(error)
      }

      return data;
  }

  async getMetadataById(index){
      let data = null;

      try {
          data = await this.instance.getSingleIdMetaData(index).call();
      } catch (error) {
          console.log(error);
      }

      return data;
  }

  async setIdMetadata(metadata, accounts){

    let tx = null;
    let events = null;

    try {
        tx = await this.instance.addIdMetadata(metadata).send({from: accounts[0]});
        events = tx.events.metadataAdded.returnValues;
    } catch (error) {
        console.log(error);
    }
    return events;
  }

  getInstance() {
    return this.instance;
  }
}

export default Identity;

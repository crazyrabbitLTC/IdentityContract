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
    let tx;
    let events;
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

  async getMetadataById(id){
      let data = null;

      try {
          data = await this.instance.getSingleIdMetaData(id).call();
      } catch (error) {
          console.log(error);
      }

      return data;
  }

  async setIdMetadata(metadata){

    let tx;
    let events;

    try {
        tx = await this.instance.addIdMetadata(metadata)
    } catch (error) {
        
    }
  }

  getInstance() {
    return this.instance;
  }
}

export default Identity;

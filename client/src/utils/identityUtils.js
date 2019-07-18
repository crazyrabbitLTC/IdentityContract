class Identity {
  //Note this default address is dangerous, need to think of something better.
  constructor(instance, defaultAddress = "0x0000000000000000000000000000000000000000") {
    this.instance = instance;
    this.defaultAddress = defaultAddress;
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
          data = await this.instance.metadata(index).call();
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

  async contractCreate(bytecode, accounts, returnAllEvents = false){
    let tx = null;
    let events = null;
    let expandedEvents = null;
    
    try {
      tx = await this.instance.execute(1, accounts[0], 0, bytecode, 0).send({from: accounts[0]});
      expandedEvents = tx.events;
      events = tx.events.contractCreated.returnValues;

    } catch (error) {
      console.log(error) 
    }

    if(returnAllEvents){
      return expandedEvents;
    } else {
      return events;
    }
  }

  async contractCreate2(bytecode, accounts, salt, returnAllEvents = false){
    let tx = null;
    let events = null;
    let expandedEvents = null;

    try {
      
      tx = await this.instance.execute(2, accounts[0], 0, bytecode, salt).send({from: accounts[0]});
      expandedEvents = tx.events;
      events = tx.events.contractCreated.returnValues;
    } catch (error) {
      console.log(error)
    }

    if(returnAllEvents){
      return expandedEvents;
    }else {
      return events;
    }
  }

  async contractCreate2Mock(bytecode, accounts, salt) {

    
  }

  getInstance() {
    return this.instance;
  }
}

export default Identity;

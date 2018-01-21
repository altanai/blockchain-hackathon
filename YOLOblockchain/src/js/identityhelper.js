

App = {
  web3Provider: null,
  contracts: {},
  SmartIdentity : "",
  user : {},
  retailBank : {},
  commercialBank : {},
  kycAttributeHash,
  endorsementHash;

  init: function() {
    try{

        alice.address = "0x9cfe28b44c0acd99f2004aae5369e80813a8858b";
        retailBank.address = "0x4f2789ede7f2e1c2489c4dab0d43c8c463f8f806";
        commercialBank.address = "0x431ffa621553a20b6f06b027a0e835678d76efe8";
        kycAttributeHash = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096dc3ff';
        endorsementHash = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d54d5';

      $.getJSON('profile.json', function(data) {
        console.log(" ...................................profile " , data );
         var petsRow = $('#ProfileShowDiv');
         petsRow.html(JSON.stringify(data, undefined, 2));
      });
    }catch(e){
      console.error(e)
    }

    return App.initWeb3();
  },

  initWeb3: function() {
    console.log(" ...................................init web3 " );
       var petsRow = $('#petsRow');
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://192.168.3.226:7545');
    }
    web3 = new Web3(App.web3Provider);

    //return App.initContract();
  },

  initContract: function() {

    console.log(" ...................................initContract" );


    $.getJSON('SmartIdentityRegistry.json', function( data) {

      console.log(" [SmartIdentityRegistry]" , data);
      if(data.contractName=="SmartIdentityRegistry"){

      // Get the necessary contract artifact file and instantiate it with truffle-contract
      this.SmartIdentityRegistryArtifact = data;
      App.contracts.SmartIdentityRegistry = TruffleContract(this.SmartIdentityRegistryArtifact);

      // Set the provider for our contract
      App.contracts.SmartIdentityRegistry.setProvider(App.web3Provider);


      var coinbase = web3.eth.coinbase;
      console.log(coinbase);
    
      var contract = web3.eth.contract(data);
      console.log(contract);

      /*var instance = contract.at(conadd);
      console.log(instance);*/


      // Use our contract add Registry
      return App.addRegistry();
    }else{
      console.log(" some other random response ");
    }

    });

    return App.bindEvents();
  },

  bindEvents: function() {
    //When user submits a contract inot registry
    $(document).on('click', '#VerifyBtn', App.handleVerified);
    $(document).on('click', '#RejectBtn', App.handleRejected);

    $(document).on('click', '#SubmitContractBtn', App.submitContract);
    $(document).on('click', '#ApproveContractBtn', App.approveContract);

  },

  addRegistry: function(){
    console.log("[Add Registry]");

    contracthash1 = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d54d5';
    contracthash2 = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096dc3ff';
    try{

      var accounts = web3.eth.accounts;
      //var accounts = web3.eth.getAccounts;
/*    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.error(error);
      }*/
      console.log("[Add Registry] Accounts",  accounts );

      contractRegistry1 = accounts[0];
      //contractRegistry2 = accounts[1];



/*      this.SmartIdentityRegistryArtifact.new({from: contractRegistry1})
      .then(function(response) {
        this.registry = response;
        console.log("[Add registery] contractRegistry1 respo" , response);
      })
      .catch(function(err) {
        console.log(err);
      });*/

      App.contracts.SmartIdentityRegistry.deployed().then(function(instance) {
        SmartIdentityRegistryInstance = instance;
        console.log("[Add registery] contractRegistry1 " , instance);

        // Execute adopt as a transaction by sending account
        //return SmartIdentityRegistryInstance.adopt(petId, {from: account});
        return SmartIdentityRegistryInstance.submitContract(contracthash1, {from: contractRegistry1})
      }).then(function(result) {
        //return App.markAdopted();
        return  SmartIdentityRegistryInstance.approveContract(contracthash1, {from: contractRegistry1})
      }).catch(function(err) {
        console.log(err.message);
      });

    }catch(e){
      console.error(e);
    }
},

// submit a contract into the registry
/*submitContract: function(){
    event.preventDefault();
    App.contracts.SmartIdentityRegistry.submitContract(this.contracthash1, {from: this.contractRegistry1})
          .then(function(response) {
              if(response=='Contract submitting failed'){
                console.log(response);
              };
    });
},*/

approveContract: function(){
      App.contracts.SmartIdentityRegistry.approveContract(contracthash1, {from: contractRegistry1})
            .then(function(response) {
                if(response== 'Contract approval failed'){
                  console.log(response);
                }
            });
},

  markVerified: function(){


    var adoptionInstance;

    App.contracts.Adoption.deployed().then(function(instance) {
      adoptionInstance = instance;
      return adoptionInstance.getAdopters.call();
    }).then(function(adopters) {
      for (i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    }).catch(function(err) {
      console.log(err.message);
    });

  },

  handleVerified:function(){

      var adoptionInstance;

      web3.eth.getAccounts(function(error, accounts) {
        if (error) {
          console.log(error);
        }

        var account = accounts[4];

        App.contracts.Adoption.deployed().then(function(instance) {
          adoptionInstance = instance;

          // Execute adopt as a transaction by sending account
          return adoptionInstance.adopt(petId, {from: account});
        }).then(function(result) {
          return App.markAdopted();
        }).catch(function(err) {
          console.log(err.message);
        });
      });

  },

markReject: function(){

},

handleReject: function(){
}

};

$(function() {
  $(window).load(function() {
    App.init();
  });

});

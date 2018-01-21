var restify = require('restify');
var SmartIdentity = artifacts.require("SmartIdentity");


function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

var owner,
endorser,
thirdparty,
attributeHash1,
attributeHash2,
attributeHash3,
attributeHash4;

var smartIdentity,
owner,
override,
thirdparty,
extraaccount;

contract('SmartIdentity', function(accounts) {

    attributeHash1 = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d54d5'; // Name
    attributeHash2 = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096dc3ff'; // DOB
    attributeHash3 = '0xca02b2202ffaacbd499438ef6d594a48f7a7631b60405ec8f30a0d7c096d1A2B'; // Phone
    attributeHash4 = '0xbc614e0000000000000000000000000000000000000000000000000000000000'; // Pancard

	owner = accounts[0];
	endorser = accounts[3];
	thirdparty = accounts[2];
    extraaccount = accounts[1];
	override = owner;

	console.log(" Owner " , owner );
	console.log(" Endorser " , endorser);
	console.log(" Thirdparty " , thirdparty);
    console.log(" extraaccount " , extraaccount);
	console.log(" Override " , override);

    SmartIdentity.new({from: owner})
    .then(function(data) {
        smartIdentity = data;
    });

} , 9000);

function getAttribute(req, res, next){
	var newAttributeHash = req.params.name;
	smartIdentity.attributes.call( newAttributeHash)
		.then(function(response) {
			res.send(response.valueOf());
			next();
		});
}

/**
 * @api {get} /addId/:name  create a new user and set as owner 
 * @apiName addAttribute
 * @apiGroup Attributes
 *
 * @apiParam {name} add attributes with attributeHash 
 *
 */
function addAttribute(req, res, next){
	smartIdentity.addAttribute(attributeHash1, {from: owner})
        .then(function(response) {
        	var addAttributeStatus;
        	if(response){
        		addAttributeStatus = (response.logs[0].args.status? response.logs[0].args.status: response);
        	}
        	var result = {
	    		status: addAttributeStatus,
	    		description: response,
	    		result :  ""
	    	}

            res.send( result);
            next();
        });
}

/**
 * @api {get} /updateattribute/:name  updates user Attribute 
 * @apiName updateAttribute
 * @apiGroup Attributes
 *
 * @apiParam {name} attribute hash from IPFS system 
 *
 */
function updateAttribute(req, res, next){
	var newAttributeHash = req.params.name;
	var oldAttributeHash = attributeHash4;

    smartIdentity.updateAttribute(oldAttributeHash, newAttributeHash, {from: owner})
    .then(function(response) {
        var debugStatus = (response.logs[0].args.status? response.logs[0].args.status: response);
        console.log(" Debug status " , debugStatus );
        //assert.equal(5, debugStatus, "Transaction returned unexpected status");

        var removeAttributeStatus = response.logs[1].args.status;
        console.log(" Remove Attribute status " , removeAttributeStatus);
        //assert.equal(3, removeAttributeStatus, "Transaction returned unexpected status");

        var addAttributeStatus = response.logs[2].args.status;
        console.log(" Add Attribute status " , addAttributeStatus);
        //assert.equal(4, addAttributeStatus, "Transaction returned unexpected status");

        var updateAttributeStatus = response.logs[3].args.status;
        console.log(" updateAttributeStatus " , updateAttributeStatus);
        //assert.equal(3, updateAttributeStatus, "Transaction returned unexpected status");

        //assert.isOk(response, "Attribute update failed");
		var result = {
			status: updateAttributeStatus,
			description: "attribut updated",
			result :  ""
		}

		res.send( updateAttributeStatus);

		next();

    });

}


/**
 * @api {get} /addId/:name  create a new user and set as owner 
 * @apiName addid
 * @apiGroup identity
 *
 * @apiParam {name} address account address of user
 *
 */
function removeAttribute(req, res, next){
	smartIdentity.removeAttribute(attributeHash1, {from: owner})
        .then(function(response) {
            var removeAttributeStatus = response.logs[0].args.status;

            if(removeAttributeStatus==3 || removeAttributeStatus==undefined ){
	    		message = "Transaction returned unexpected status";
	    	}else{
	    		message = "Attribute removal failed";
	    	}
	    	var result = {
	    		status: removeAttributeStatus,
	    		description: message,
	    		result :  ""
	    	}

            res.send( removeAttributeStatus);
            next();

            //assert.equal(3, removeAttributeStatus, "Transaction returned unexpected status");
            //assert.isOk(response, "Attribute removal failed");
        });
}


function getAllAccounts(req, res, next){

    var result = {
		owner: owner,
		endorser: endorser,
		thirdparty :  thirdparty
	};

    res.send( result);
    next();

}


/**
 * @api {get} /addId/:name  create a new user and set as owner 
 * @apiName addid
 * @apiGroup identity
 *
 * @apiParam {name} address account address of user
 *
 */
function addId(req, res, next){
	owner = req.params.name;
	SmartIdentity.new({from: owner})
		.then(function(identity) {
        	return identity.setOwner(thirdparty, {from: override})
        }).then(function(response) {
        	console.log(" [addUser] response : " , response);
        	var newOwnerStatus;
        	if(response){
        		newOwnerStatus = response.logs[0].args.status;
        	}

	        if(newOwnerStatus==3 || newOwnerStatus==undefined ){
	    		message = "Transaction returned unexpected status";
	    	}
	    	var result = {
	    		status: newOwnerStatus,
	    		description: message,
	    		result :  ""
	    	}

            res.send( result);
            next();
        });
}

/**
 * @api {get} /lock/:name newContract given to a third party 
 * @apiName lock
 * @apiGroup Locks
 *
 */
function lock(){
    //mine through 20 blocks to simulate the blocklock time passing
    for (var i = 1; i < 21; i++) {
      lockhelper("BLOCK MINING " + i, function (){
        return SmartIdentity.new();
      });
    }
}
function lockhelper(str , callback){
    return callback;
}


/**
 * @api {get} /newContract/:name newContract given to a third party 
 * @apiName newcontract
 * @apiGroup Contract
 *
 * @apiParam {name} yolo id of address of thirdparty
 *
 */
function newContract(req, res, next){
	owner = req.params.name;
    SmartIdentity.new({from: owner}).then(function(identity) {
        return identity.setOverride(thirdparty, {from: override})
    }).then(function(response) {
    	var newOverrideStatus , message;
    	if(response){
    		newOverrideStatus = response.logs[0].args.status;
    	}

    	if(newOverrideStatus==3 || newOverrideStatus==undefined ){
    		message = "Transaction returned unexpected status";
    	}
    	var result = {
    		status: newOverrideStatus,
    		description: response,
    		result :  ""
    	}
        res.send( result);
    	next();

    });
}


/**
 * @api {get} /killContract/:name killContract given to a third party 
 * @apiName killcontract
 * @apiGroup Contract
 *
 * @apiParam {name} yolo id of address of thirdparty
 *
 */
function killContract(req, res, next){
	thirdparty = req.params.name;
    smartIdentity.kill({from: thirdparty}).then(function() {
        res.send( web3.eth.getBalance(smartIdentity.address).valueOf());
        next();
    });

}


/**
 * @api {get} /setpublickey/:name setSigningPublicKey
 * @apiName setSigningPublicKey
 * @apiGroup Keys
 *
 * @apiParam {name} publicSigningKey public Signing Key
 *
 */
function setSigningPublicKey(req, res, next){
    publicSigningKey = req.params.name;

    smartIdentity.setSigningPublicKey(publicSigningKey, {from: owner})
            .then(function(response) {
                var newSigningKeyStatus = response.logs[0].args.status;

        if(newSigningKeyStatus==3 || newSigningKeyStatus==undefined ){
            message = "Transaction returned unexpected status";
        }
        var result = {
            status: newSigningKeyStatus,
            description: response,
            result :  ""
        }
        res.send( result);
        next();

    });
}


/**
 * @api {get} /setpublickey/:name signingPublicKey
 * @apiName signingPublicKey
 * @apiGroup Keys
 *
 */
function signingPublicKey(req, res, next){

    smartIdentity.signingPublicKey.call({from: owner})
            .then(function(response) {
        if(response == publicSigningKey){
            message = "Transaction returned unexpected status";
        }
        var result = {
            status: 2,
            description: response,
            result :  ""
        }
        res.send( result);
        next();

    });
}


/**
 * @api {get} /setpublickey/:name setEncryptionPublicKey
 * @apiName setEncryptionPublicKey
 * @apiGroup Keys
 *
 * @apiParam {name} publicEncryptionKey public Encryption Key
 *
 */
function setEncryptionPublicKey(req, res, next){
    publicEncryptionKey = req.params.name;
    smartIdentity.setEncryptionPublicKey(publicEncryptionKey, {from: owner})
            .then(function(response) {

        var newEncryptKeyStatus , message;
        if(response){
            newEncryptKeyStatus = response.logs[0].args.status;
        }

        if(newEncryptKeyStatus==3 || newEncryptKeyStatus==undefined ){
            message = "Transaction returned unexpected status";
        }
        var result = {
            status: newEncryptKeyStatus,
            description: response,
            result :  ""
        }
        res.send( result);
        next();
    });
}

/**
 * @api {get} /encryptionkey/:name checkencryptionkey
 * @apiName checkencryptionkey
 * @apiGroup Keys
 *
 * @apiParam {name} publicEncryptionKey public Encryption Key
 *
 */
function checkencryptionkey(req, res, next){
     publicEncryptionKey = req.params.name;

     smartIdentity.encryptionPublicKey.call({from: owner})
            .then(function(response) {

        var EncryptKeyStatus , message;
        if(response){
            EncryptKeyStatus = response.logs[0].args.status;
        }

        if(EncryptKeyStatus==3 || EncryptKeyStatus==undefined ){
            message = "Transaction returned unexpected status";
        }
        var result = {
            status: EncryptKeyStatus,
            description: response,
            result :  ""
        }
        res.send( result);
        next();


    });

}

var server = restify.createServer();
server.pre(restify.pre.sanitizePath());
server.get('/hello/:name', respond);
server.get('/addid/:name', addId);
server.get('/setpublickey/:name',setEncryptionPublicKey);
server.get('/encryptionkey/:name',checkencryptionkey);
server.get('/allaccounts/', getAllAccounts);
server.get('/getattribute/:name', getAttribute);
server.get('/addattribute/:name', addAttribute);
server.get('/updateattribute/:name', updateAttribute);
server.get('/removeattribute/:name', removeAttribute);
server.get('/newcontract/:name', newContract);
server.get('/revokecontract/:name', killContract);

server.listen(8080, function() {
  console.log('%s listening at %s', server.name, server.url);
});
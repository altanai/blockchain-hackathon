var Adoption = artifacts.require("Adoption");
var SmartIdentity = artifacts.require("SmartIdentity.sol");
var SmartIdentityRegistry = artifacts.require("SmartIdentityRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(Adoption);
  deployer.deploy(SmartIdentity);
  deployer.deploy(SmartIdentityRegistry);
  deployer.link(SmartIdentity, SmartIdentityRegistry);

};
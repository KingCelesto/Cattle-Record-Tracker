const CattleTracker = artifacts.require("CattleTracker");

module.exports = function (deployer) {
  deployer.deploy(CattleTracker);
};

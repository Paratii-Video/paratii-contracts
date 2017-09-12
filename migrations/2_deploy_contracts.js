var ConvertLib = artifacts.require('./ConvertLib.sol')
var ParatiiToken = artifacts.require('./paratii/ParatiiToken.sol')

module.exports = function (deployer) {
  deployer.deploy(ConvertLib)
  deployer.link(ConvertLib, ParatiiToken)
  deployer.deploy(ParatiiToken)
}

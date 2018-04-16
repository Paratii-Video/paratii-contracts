/* global artifacts */

const ParatiiToken = artifacts.require('./paratii/ParatiiToken.sol')

module.exports = (deployer) => {
  deployer.deploy(ParatiiToken)
}

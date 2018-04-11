/* global artifacts */

const Tcr = artifacts.require('./tcr/Tcr.sol');
const Token = artifacts.require('./paratii/ParatiiToken.sol');
const Parameterizer = artifacts.require('Parameterizer.sol');
const DLL = artifacts.require('dll/DLL.sol');
const AttributeStore = artifacts.require('attrstore/AttributeStore.sol');
const PLCRVoting = artifacts.require('PLCRVoting.sol');

module.exports = (deployer, network, accounts) => {
  async function approveTcrFor(addresses) {
    const token = await Token.deployed();
    const user = addresses[0];
    const balanceOfUser = await token.balanceOf(user);
    await token.approve(Tcr.address, balanceOfUser, { from: user });
    if (addresses.length === 1) { return true; }
    return approveTcrFor(addresses.slice(1));
  }

  deployer.link(DLL, Tcr);
  deployer.link(AttributeStore, Tcr);

  return deployer.then(async () => {
    let tokenAddress = Token.address;
    console.log('Tcr tokenAddress: ', tokenAddress)

    return deployer.deploy(
      Tcr,
      tokenAddress,
      PLCRVoting.address,
      Parameterizer.address,
      'Paratii Main TCR',
    );
  })
    .then(async () => {
      if (network === 'test') {
        await approveTcrFor(accounts);
      }
    }).catch((err) => { throw err; });
};

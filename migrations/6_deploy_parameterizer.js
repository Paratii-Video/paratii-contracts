/* global artifacts */

// const Token = artifacts.require('EIP20.sol')
const ParatiiToken = artifacts.require('./paratii/ParatiiToken.sol')
const Parameterizer = artifacts.require('Parameterizer.sol')
const DLL = artifacts.require('dll/DLL.sol')
const AttributeStore = artifacts.require('attrstore/AttributeStore.sol')
const PLCRVoting = artifacts.require('PLCRVoting.sol')

module.exports = (deployer, network, accounts) => {
  async function approveParameterizerFor (addresses) {
    const token = await ParatiiToken.deployed()
    const user = addresses[0]
    const balanceOfUser = await token.balanceOf(user)
    await token.approve(Parameterizer.address, balanceOfUser, { from: user })
    if (addresses.length === 1) { return true }
    return approveParameterizerFor(addresses.slice(1))
  }

  deployer.link(DLL, Parameterizer)
  deployer.link(AttributeStore, Parameterizer)

  return deployer.then(async () => {
    const parameterizerConfig = {
      minDeposit: 10,
      pMinDeposit: 100,
      applyStageLength: 600,
      pApplyStageLength: 1200,
      commitStageLength: 600,
      pCommitStageLength: 1200,
      revealStageLength: 600,
      pRevealStageLength: 1200,
      dispensationPct: 50,
      pDispensationPct: 50,
      voteQuorum: 50,
      pVoteQuorum: 50
    }

    let tokenAddress = ParatiiToken.address
    console.log('parameterizer tokenAddress:', tokenAddress)

    return deployer.deploy(
  Parameterizer,
  tokenAddress,
  PLCRVoting.address,
  parameterizerConfig.minDeposit,
  parameterizerConfig.pMinDeposit,
  parameterizerConfig.applyStageLength,
  parameterizerConfig.pApplyStageLength,
  parameterizerConfig.commitStageLength,
  parameterizerConfig.pCommitStageLength,
  parameterizerConfig.revealStageLength,
  parameterizerConfig.pRevealStageLength,
  parameterizerConfig.dispensationPct,
  parameterizerConfig.pDispensationPct,
  parameterizerConfig.voteQuorum,
  parameterizerConfig.pVoteQuorum
  )
  })
  .then(async () => {
    if (network === 'test') {
      await approveParameterizerFor(accounts)
    }
  }).catch((err) => { throw err })
}

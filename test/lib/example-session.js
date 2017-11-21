import { Paratii } from '../../lib/paratii.js'

contract('Paratii API:', function () {
  let paratii
  let contracts

  beforeEach(async function () {
    paratii = Paratii
    // paratii.init()
    contracts = await paratii.getOrDeployContracts()
  })

  it('example session from ../docs/example-session.md should work', async function () {
    return contracts
  })
})

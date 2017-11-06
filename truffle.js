require('babel-polyfill')
require('babel-register')({
  'presets': ['es2015'],
  'plugins': ['syntax-async-functions', 'transform-regenerator']
})

module.exports = {
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  },
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    test: {
      host: 'localhost',
      port: 8545,
      network_id: '*' // Match any network id
    },
    paratii: {
      host: 'chain.paratii.video',
      port: 80,
      network_id: '1' // Match any network id
    },
    paratii_local: {
      host: 'localhost',
      port: 8999,
      network_id: '1' // Match any network id
    }
  }
}

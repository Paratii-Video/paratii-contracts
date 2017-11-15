// Call as `npm run node scripts/installFixture.js path/to/fixture.js`
require('babel-core/register')
require('babel-polyfill')
require('babel-register')({
  'presets': ['es2015'],
  'plugins': ['syntax-async-functions', 'transform-regenerator']
})
let Paratii = require('../lib/paratii.js').Paratii

async function installFixture (pathToFixture) {
  // fixture must be a module with a 'videos' property
  pathToFixture = '../test/data/testFixture.js'
  let fixture = require(pathToFixture)
  console.log(`registering videos in ${fixture} ${fixture.videos}`)
  for (let i = 0; i < fixture.videos.length; i++) {
    let video = fixture.videos[i]
    await Paratii.getContract('VideoRegistry').registerVideo(String(video._id), video.uploader.address, Number(web3.toWei(video.price)), {from: web3.eth.accounts[0]})
    console.log(`registered video ${video._id} with price ${web3.toWei(video.price)} and owner ${video.uploader.address}`)
  }
  console.log('done installing contracts!')
  return contracts
}

module.exports = function (callback) {
  console.log('xxx')
  installFixture(process.argv[1])
  return 'xxx'
}
installFixture(process.argv[1])

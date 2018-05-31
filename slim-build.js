const folder = './build/contracts'
const fs = require('fs')

// read contracts folder
const files = fs.readdirSync(folder)

files.forEach((file) => {
  const path = `${folder}/${file}`
  // read original file
  const json = require(path)
  // pick just the thing we want
  const obj = {
    contractName: json.contractName,
    abi: json.abi,
    bytecode: json.bytecode
  }
  // overwrites original file with slim file
  fs.writeFile(`./build/contracts/${file}`, JSON.stringify(obj), (err) => {
    if (err) throw err
  })
})

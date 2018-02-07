
# Contributing

Bug reports and pull requests very much welcomed.

Please make sure test pass before submitting a PR.

We try to follow the style guidelines from http://solidity.readthedocs.io/en/develop/style-guide.html

The development id done on unix based systems.  



## Installation

Make sure you have a recent version of [node.js](https://nodejs.org/) (7.6 and above) and [yarn](https://yarnpkg.com) package manager.

Installation of dependencies. After cloning the repository run:

    yarn

## Run the tests

To run the test locally use a local blockchain using ganache (testrpc), open a terminal window and run:

    yarn ganache

On a second terminal, run the tests:

    yarn test

This command will run two different commands:

1. `yarn mocha` will run tests on the library, which are in the directory `mocha-test`;
2. `yarn truffle-test` runs tests on the solidity contracts using the truffle framework


# Style

For solidity, we are following the style guide here: http://solidity.readthedocs.io/en/develop/style-guide.html

A Solidity linter (solium is installed, which can be run with:

    yarn solium

Code should survive Javascript linting as well:

    yarn lint

# Breakpoints

if you run tests with:

    node debug ./node_modules/truffle/build/cli.bundled.js test

it is possible to use `debugger` statemetns and inspect the state

# Contribute

Look at the issues https://github.com/Paratii-Video/paratii-contracts/issues

Or reach out on Gitter: https://gitter.im/Paratii-Video/paratii-contracts

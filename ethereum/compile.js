const path = require('path');
const solC = require('solc');
const fs = require('fs-extra'); // improved version of fs module with extra functions

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath); // deletes the build folder to cleanup

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf8');
const output = solC.compile(source, 1).contracts;

fs.ensureDirSync(buildPath); // checks build folder and creates one if none exists

for (let contract in output) {
    fs.outputJsonSync(
      path.resolve(buildPath, `${contract.replace(":", "")}.json`),
      output[contract]
    );
}
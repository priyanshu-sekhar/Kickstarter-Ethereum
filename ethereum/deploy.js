const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./build/CampaignFactory.json');

const MNEMONIC = 'yellow route grass amount arctic rather mixture pool cruise limit horn absorb';
const ENDPOINT = 'https://rinkeby.infura.io/v3/09023b67f1bd45d5baf6f394341822a3';
const GAS_SPENT = '1000000';

const provider = new HDWalletProvider(
    MNEMONIC,
    ENDPOINT
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            arguments: []
        })
        .send({
            gas: GAS_SPENT,
            from: accounts[0]
        });

    console.log(interface);
    console.log('Contract deployed to address', result.options.address);
};
deploy()
    .then(() => console.log("deployed"))
    .catch(err => console.log(err));
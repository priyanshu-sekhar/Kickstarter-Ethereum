const assert = require('assert');
const ganache = require('ganache-cli');
const options = { gasLimit: '80000000' };
const Web3 = require('web3');
const web3 = new Web3(ganache.provider(options));

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
   accounts = await web3.eth.getAccounts();

   factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
       .deploy({data: compiledFactory.bytecode, arguments: []})
       .send({from: accounts[0], gas: '1000000'});

   await factory.methods.createCampaign('100').send({
       from: accounts[0],
       gas: '1000000'
   });

   [campaignAddress] = await factory.methods.getDeployedCampaigns().call(); // [es16 syntax] assign the first element in array to campaignAddress
   campaign = await new web3.eth.Contract(
       JSON.parse(compiledCampaign.interface),
       campaignAddress
   );
});

describe('Campaigns', () => {
    it('should deploy a factory and a campaign', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('should mark caller as campaign manager', async () => {
        const manager = await campaign.methods.manager().call();

        assert.strictEqual(accounts[0], manager);
    });

    it('should allow people to contribute and become campaign approver', async () => {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });

        const isContributor = campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('should require minimum contribution', async () => {
        try {
            await campaign.methods.contribute().send({
               value: '5',
               from: accounts[1]
            });

            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it('should allow a manager to make a payment request', async () => {
        const requestDescription = 'Test Request'
;
        await campaign.methods.createRequest(
            requestDescription,
            '100',
            accounts[1]
        )
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        const request = await campaign.methods.requests(0).call();
        assert.strictEqual(request.description, requestDescription);
    });

    it('should processes request', async () => {
        await campaign.methods.contribute().send({
            from: accounts[0],
            value: web3.utils.toWei('10', 'ether')
        });

        await campaign.methods.createRequest(
            'Test Request',
            web3.utils.toWei('5', 'ether'),
            accounts[2]
        )
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        await campaign.methods.approveRequest(0)
            .send({
                from: accounts[0],
                gas: '1000000'
            });

        await campaign.methods.finalizeRequest(0)
            .send({
                from: accounts[0],
                gas: '10000000'
            });

        let balance = await web3.eth.getBalance(accounts[2]);
        balance = await web3.utils.fromWei(balance.toString(), 'ether');
        balance = parseFloat(balance);

        console.log(balance);
        assert(balance > 104);
    });
});
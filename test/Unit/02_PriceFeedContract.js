const PriceFeedContract = artifacts.require("PriceConsumerV3");
const chainID = config.network_id;
const { NetworkConfig } = require('../../helper-truffle-config');

(1 == chainID ? contract : contract.skip)
("Contract Name : PriceConsumerV3", async (accounts) => {
        var contractInstance;
        before(async function () {
            
            console.log('Contract Address : ', PriceFeedContract.address);
            contractInstance = await PriceFeedContract.deployed();
        });
        it('Test Case 1 : Fetch Price of Ethereum in USD', async () => {
            let price = await contractInstance.getLatestPrice();
            console.log("Price of Ethereum : ", price.toNumber());
            assert(1000 * 100000000 <= price.toNumber() && price.toNumber() <= 1500 * 100000000, "Price should be between 1000 to 1500 USD");
        });
        it('Test Case 2 : Fetch Price of USDT in USD', async () => {
            let address = await NetworkConfig[chainID].USDT_USD;
            let price = await contractInstance.getLatestPrice(address);
            console.log("Price of USDT : ", price.toNumber());
            assert (0.9975 * 100000000 <= price.toNumber() && price.toNumber() <= 1.025 * 100000000, "Price should be between 0.9975 to 1.025 USD");
        });
});
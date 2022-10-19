const Web3 = require('web3');
const config1 = require('../build/contracts/ExchangeContract.json');
const config2 = require('../build/contracts/PriceConsumer.json');
const config3 = require('../build/contracts/USDT.json');
const { NetworkConfig } = require('../helper-truffle-config');
const chainID = config.network_id;
module.exports = async function(){
    const accounts = await Web3.eth.getAccounts();

    const PriceFeedContractAddress = config2.networks[chainID].address;
    const PriceFeedContractABI = config2.abi;
    
};
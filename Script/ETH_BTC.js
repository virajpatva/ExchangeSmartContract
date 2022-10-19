const Web3 = require('web3');
const config1 = require('../build/contracts/ExchangeContract.json');
const config2 = require('../build/contracts/PriceConsumerV3.json');
const config3 = require('../build/contracts/USDT.json');
const { NetworkConfig } = require('../helper-truffle-config');


module.exports = async function(){
    const accounts = await web3.eth.getAccounts();
    let network_Id =await web3.eth.net.getId();
    const PriceFeedContractAddress = config2.networks[network_Id].address;
    const PriceFeedContractABI = config2.abi;
    const PriceFeedContractInstance = new web3.eth.Contract(PriceFeedContractABI,PriceFeedContractAddress);
    
    const Price =await PriceFeedContractInstance.methods.getLatestPrice(NetworkConfig[network_Id].ETH_BTC).call();
    console.log("ETH/BTC ===> ", Price);
};
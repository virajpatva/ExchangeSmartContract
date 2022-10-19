const ExchangeContract = artifacts.require('ExchangeContract');
const USDT = artifacts.require('USDT');
const wBTC = artifacts.require('WrappedBTC');
const PriceFeedContract = artifacts.require("PriceConsumerV3");
const { NetworkConfig } = require('../helper-truffle-config.js');
const chainID = config.network_id;
module.exports = function (deployer){
    deployer.deploy(ExchangeContract,PriceFeedContract.address,USDT.address,wBTC.address,NetworkConfig[chainID].ETH_BTC);
}
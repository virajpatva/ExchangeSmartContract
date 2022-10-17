const PriceFeedContract = artifacts.require("PriceConsumerV3");

module.exports = function (deployer) {
    deployer.deploy(PriceFeedContract);
}

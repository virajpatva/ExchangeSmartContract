const USDT = artifacts.require("USDT");
const PriceFeedContract = artifacts.require("PriceConsumerV3");
const ExchangeContract = artifacts.require("ExchangeContract");
const truffleAssert = require("truffle-assertions");
require("web3");
const chainID = config.network_id;

(chainID == 1 ? contract : contract.skip)(
  "Contract Name : Exchange Contract",
  async (accounts) => {
    var contractInstance;
    var USDTTokenInstance;
    var PriceFeedInstance;
    var price;
    before(async () => {
      contractInstance = await ExchangeContract.deployed();
      USDTTokenInstance = await USDT.deployed();
      PriceFeedInstance = await PriceFeedContract.deployed();
      price = await PriceFeedInstance.getLatestPrice();
    });

    it("Sending ether to contract", async () => {
      await contractInstance.sendTransaction({
        from: accounts[0],
        value: web3.utils.toWei("1", "ether"),
      });
      await web3.eth
        .getBalance(contractInstance.address)
        .then((x) =>
          assert(
            x == web3.utils.toWei("1", "ether"),
            "Sending contract ether failed"
          )
        );
    });

    it("Can't withdraw ether from another account ", async () => {
      truffleAssert.fails(
        contractInstance.WithdrawEth.sendTransaction({ from: accounts[1] })
      );
    });

    it("Can withdraw ether from owner account ", async () => {
      truffleAssert.passes(
        contractInstance.WithdrawEth.sendTransaction({ from: accounts[0] })
      );
    });

    it("Transfer USDT for Eth", async () => {
      bal1 = await web3.eth.getBalance(accounts[1]);

      await contractInstance.sendTransaction({
        from: accounts[0],
        value: web3.utils.toWei("1", "ether"),
      });
      price = await PriceFeedInstance.getLatestPrice.call();
      await USDTTokenInstance.mint.sendTransaction(accounts[1], price);

      await USDTTokenInstance.balanceOf
        .call(accounts[1])
        .then(console.log.toString());

      await USDTTokenInstance.totalSupply.call().then(console.log.toString());
      await USDTTokenInstance.approve.sendTransaction(
        contractInstance.address,
        price,
        { from: accounts[1] }
      );
      await contractInstance.USDTtoETH.sendTransaction(1, {
        from: accounts[1],
      });
      bal = await web3.eth.getBalance(accounts[1]);
      tokenUser = await USDTTokenInstance.balanceOf.call(accounts[1]);
      tokenContract = await USDTTokenInstance.balanceOf.call(
        contractInstance.address
      );
      assert(tokenContract.toString() == price.toString() && bal1 < bal);
    });

    it("Tranfer USDT to owner", async () => {
      tokenContract = await USDTTokenInstance.balanceOf.call(
        contractInstance.address
      );
      await contractInstance.TransferUSDT.sendTransaction({
        from: accounts[0],
      });
      tokenUser = await USDTTokenInstance.balanceOf.call(accounts[0]);
      assert(tokenContract.toString() == tokenUser.toString());
    });
  }
);
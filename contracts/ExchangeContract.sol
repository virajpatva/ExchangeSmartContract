// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "./PriceFeedContract.sol";
import "./USDTContract.sol";

contract ExchangeContract{ 

    PriceConsumerV3 PriceFeedInstance;
    USDT USDTContractInstance;
    address owner ; 

    constructor(address PriceFeedAddress,address USDTContractAddress){
        PriceFeedInstance = PriceConsumerV3(PriceFeedAddress);      
        USDTContractInstance = USDT(USDTContractAddress);
        owner = msg.sender;
    }

    modifier OnlyOwner(){
        require(msg.sender == owner , 'Only Owner');
        _;
    }

    function USDTtoETH (uint EthQty) public payable{
        require(address(this).balance >= EthQty,"Invalid Quantity");
        uint latestPrice = uint(PriceFeedInstance.getLatestPrice());
        uint USDTQty = latestPrice * EthQty;
        USDTContractInstance.transferFrom(msg.sender,address(this),USDTQty);
        payable (msg.sender).transfer(EthQty * 10 ** 18);
    }

    fallback () external payable{

    }

    function WithdrawEth() public payable OnlyOwner{
        payable(msg.sender).transfer(address(this).balance);
    }

    function TransferUSDT() public OnlyOwner{
        uint contractBalance = USDTContractInstance.balanceOf(address(this));
        require(contractBalance >= 0 , "Zero Balance");
        USDTContractInstance.transfer(msg.sender,contractBalance);
    }
}
pragma solidity 0.4.19;

import {Ownable} from "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract ResourceTokenIfc {
    function isMintingManager(address addr) public returns (bool);
}


contract Mine is Ownable {

    struct MineInstance {
        uint256 buildTime;
        uint256 lastMiningTime;
        uint256 totalMined;
    }

    struct ResourceCost {
        ResourceTokenIfc resource;
        uint256 amount;
    }

    mapping(address => MineInstance) private instancesByOwner;

    ResourceCost[] private cost;

    modifier onlyEqual(uint256 a, uint256 b) {
        require(a == b);
        _;
    }

    modifier onlyWithoutPrices(){
        require(cost.length == 0);
        _;
    }


    function setCost(ResourceTokenIfc[] resources, uint256[] amounts)
    public
    onlyOwner
    onlyWithoutPrices
    onlyEqual(resources.length, amounts.length)
    {
        for (uint256 i = 0; i < resources.length; i++) {
            require(resources[i] != address(0));
            require(amounts[i] > 0);
            require(resources[i].isMintingManager(this));

            cost.push(ResourceCost({
                resource : resources[i],
                amount : amounts[i]
                }));
        }
    }

    function buildMine() public {

        instancesByOwner[msg.sender] = MineInstance({
            buildTime : now,
            lastMiningTime : now,
            totalMined : 0
            });
    }

    function getCostResourcesCount() public view returns (uint256){
        return cost.length;
    }

    function getCost(uint8 idx) public view returns (address resource, uint256 amount){
        return (cost[idx].resource, cost[idx].amount);
    }
}
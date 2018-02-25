pragma solidity 0.4.19;

import {Ownable} from "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract ResourceTokenIfc {
    function isMintingManager(address addr) public returns (bool);
}


contract Mine is Ownable {

    struct MineInstance {
        uint256 buildTime;
        uint256 lastMiningTime;
        uint256 mined;
    }

    struct ResourceCost {
        ResourceTokenIfc resource;
        uint256 amount;
    }

    mapping(address => MineInstance[]) private instancesByOwner;

    ResourceCost[] private costs;

    modifier onlyEqual(uint256 a, uint256 b) {
        require(a == b);
        _;
    }

    modifier onlyWithoutCost(){
        require(costs.length == 0);
        _;
    }

    modifier onlyIfCostExists(uint256 idx) {
        require(idx < costs.length);
        _;
    }

    modifier onlyIfInstanceExists(uint256 idx) {
        require(idx < instancesByOwner[msg.sender].length);
        _;
    }

    event CostSet();
    event InstanceBuild();

    function setCost(ResourceTokenIfc[] resources, uint256[] amounts)
    public
    onlyOwner
    onlyWithoutCost
    onlyEqual(resources.length, amounts.length)
    {
        for (uint256 i = 0; i < resources.length; i++) {
            require(resources[i] != address(0));
            require(amounts[i] > 0);
            require(resources[i].isMintingManager(this));

            costs.push(ResourceCost({
                resource : resources[i],
                amount : amounts[i]
                }));
        }

        CostSet();
    }

    function buildInstance() public {

        instancesByOwner[msg.sender].push(MineInstance({
            buildTime : now,
            lastMiningTime : now,
            mined : 0
            }));

        InstanceBuild();
    }

    function getCosts() public view returns (uint256){
        return costs.length;
    }

    function getCost(uint8 idx)
    public
    view
    onlyIfCostExists(idx)
    returns (address resource, uint256 amount){
        return (costs[idx].resource, costs[idx].amount);
    }

    function getInstances() public view returns (uint256) {
        return instancesByOwner[msg.sender].length;
    }

    function getInstance(uint256 idx)
    public
    view
    onlyIfInstanceExists(idx)
    returns (
        uint256 buildTime,
        uint256 lastMinedTime,
        uint256 mined
    )
    {
        MineInstance memory instance = instancesByOwner[msg.sender][idx];
        return (instance.buildTime, instance.lastMiningTime, instance.mined);
    }
}
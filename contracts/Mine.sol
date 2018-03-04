pragma solidity 0.4.19;

import {Ownable} from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import {SafeMath} from "zeppelin-solidity/contracts/math/SafeMath.sol";


contract ResourceTokenIfc {
    function isMintingManager(address addr) public returns (bool);

    function transferFrom(address from, address to, uint256 value) public returns (bool);

    function allowance(address owner, address spender) public view returns (uint256);

}


contract Mine is Ownable {

    uint256 constant public DAY_IN_SECONDS = 86400;

    using SafeMath for uint256;

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

    modifier onlyIfCostNotSet(){
        require(costs.length == 0);
        _;
    }

    modifier onlyIfCostSet() {
        require(costs.length > 0);
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
    event BuildRejected(address resource);

    function setCost(ResourceTokenIfc[] resources, uint256[] amounts)
    public
    onlyOwner
    onlyIfCostNotSet
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

    /* todo Consider scenario:
    - erc20 retruns correct allwoance
    - sender decrease allow amount
    - transferFrom reverts and previous resource token transfers will be lost
    Workaround could be implement transferFrom without reverts in this scenario
    but then it would works fine only with erc20 with this implementation
    Or maybe its impossible cause buildInstance transaction is atomic? Im not sure*/
    function buildInstance()
    public
    onlyIfCostSet
    {
        for (uint256 i; i < costs.length; i++) {
            ResourceCost storage costToCheck = costs[i];
            if (costToCheck.resource.allowance(msg.sender, this) < costToCheck.amount) {
                BuildRejected(costToCheck.resource);
                return;
            }
        }

        for (uint256 j; j < costs.length; j++) {
            ResourceCost storage cost = costs[j];
            require(cost.resource.transferFrom(msg.sender, this, cost.amount));
        }

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

    function getAvailableResource() public view returns (uint256) {
    uint256 result = 0;
    for(uint256 i = 0; i < getInstances(); i++){
        MineInstance storage mineInstance = instancesByOwner[msg.sender][i];
        result = result.add(calculateMined(mineInstance));
        }
    }

    function calculateMined(MineInstance storage mineInstance) internal view returns (uint256);

}

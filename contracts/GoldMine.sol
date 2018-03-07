pragma solidity 0.4.19;

import {Mine} from "./Mine.sol";

contract GoldMine is Mine {

    uint256 constant public DAY_IN_SECONDS = 86400;

    function calculateMined(MineInstance storage mineInstance) internal view returns (uint256) {
    //return now.sub(mineInstance.lastMiningTime).div(DAY_IN_SECONDS);
    return 1;
    }

}

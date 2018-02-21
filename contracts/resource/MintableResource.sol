pragma solidity 0.4.19;

import { SafeMath } from "zeppelin-solidity/contracts/math/SafeMath.sol";
import { Ownable } from "zeppelin-solidity/contracts/ownership/Ownable.sol";
import { BasicToken } from "zeppelin-solidity/contracts/token/ERC20/BasicToken.sol";


/**
 * @title A resource token that can increase its supply by specified addresses
 * @author kruligh
 */
contract MintableResource is Ownable, BasicToken {

    using SafeMath for uint256;

    /**
     * @dev Address from which minted tokens are Transferred.
     * @dev This is useful for blockchain explorers operating on Transfer event.
     */
    address public constant MINT_ADDRESS = address(0x0);

    /**
     * @dev Addresses allowed to create tokens
     */
    mapping (address => bool) public isMintingManager;

    /**
     * @dev Tokens minted and transferred to specified address
     * @param to address The receiver of the tokens
     * @param amount uint256 The amount of tokens
     */
    event Minted(address indexed to, uint256 amount);

    /**
     * @dev Approves specified address as a Minting Manager
     * @param addr address The approved address
     */
    event MintingManagerAdded(address addr);

    modifier onlyMintingManager(address addr) {
        require(isMintingManager[addr]);
        _;
    }

    /**
     * @dev Allow specified address to mint resource
     * @param addr address
     */
    function addMintingManager(address addr)
        public
        onlyOwner
    {
        isMintingManager[addr] = true;

        MintingManagerAdded(addr);
    }

    /**
     * @dev Create new resources and transfer them to specified address
     * @param to address The address to transfer to
     * @param amount uint256 The amount to be minted
     */
    function mint(address to, uint256 amount)
        public
        onlyMintingManager(msg.sender)
    {
        totalSupply_ = totalSupply_.add(amount);
        balances[to] = balances[to].add(amount);

        Minted(to, amount);
        Transfer(MINT_ADDRESS, to, amount);
    }
}

declare module 'blocklife-contracts' {
    import {BigNumber} from 'bignumber.js';
    import {Address, AnyNumber} from 'common';
    import {
        AnyContract,
        Contract,
        ContractBase,
        TransactionOptions,
        TransactionResult,
        TruffleArtifacts
    } from 'truffle';

    export interface Migrations extends ContractBase {
        setCompleted(completed: number, options?: TransactionOptions): Promise<TransactionResult>;

        upgrade(address: Address, options?: TransactionOptions): Promise<TransactionResult>;
    }

    export interface ERC20 extends ContractBase {
        totalSupply(): Promise<BigNumber>;

        balanceOf(who: Address): Promise<BigNumber>;

        transfer(to: Address, amount: BigNumber, options?: TransactionOptions): Promise<TransactionResult>;

        allowance(owner: Address, spender: Address): Promise<BigNumber>;

        transferFrom(from: Address,
                     to: Address,
                     value: AnyNumber,
                     options?: TransactionOptions): Promise<TransactionResult>;

        approve(spender: Address, value: AnyNumber, options?: TransactionOptions): Promise<TransactionResult>;
    }

    export interface TransferEvent {
        from: Address;
        to: Address;
        value: BigNumber;
    }

    export interface ApprovalEvent {
        owner: Address;
        spender: Address;
        value: BigNumber;
    }

    export interface Mintable {
        isMintingManager(addr: Address, options?: TransactionOptions): Promise<boolean>;

        addMintingManager(addr: Address, options?: TransactionOptions): Promise<TransactionResult>;

        mint(to: Address, amount: AnyNumber, options?: TransactionOptions): Promise<TransactionResult>;

        finishMinting(options?: TransactionOptions): Promise<TransactionResult>;
    }

    export interface MintedEvent {
        to: Address;
        amount: BigNumber;
    }

    export interface MintingManagerApprovedEvent {
        addr: Address;
    }

    export interface Resource extends ERC20, Mintable {
    }

    export interface ResourceCost {
        resource: Address;
        amount: BigNumber;
    }

    export interface MineInstance {
        buildTime: BigNumber;
        lastMiningTime: BigNumber;
        mined: BigNumber;
    }

    export type CostSet = {};
    export type InstanceBuild = {};

    export interface Mine extends ContractBase {
        setCost(resources: Address[], amounts: AnyNumber[], opt?: TransactionOptions): Promise<TransactionResult>;

        buildInstance(options?: TransactionOptions): Promise<TransactionResult>;

        getCosts(): Promise<BigNumber>;

        getCost(index: AnyNumber): Promise<any[]>;

        getInstances(options?: TransactionOptions): Promise<BigNumber>;

        getInstance(index: AnyNumber, options?: TransactionOptions): Promise<any[]>;
    }

    // todo ts lint ignore
    export interface GoldMine extends Mine {

    }

    export interface MigrationsContract extends Contract<Migrations> {
        'new'(options?: TransactionOptions): Promise<Migrations>;
    }

    export interface ResourceContract extends Contract<Resource> {
        'new'(name: string, symbol: string, decimals: AnyNumber, options?: TransactionOptions): Promise<Resource>;
    }

    export interface GoldMineContract extends Contract<GoldMine> {
        'new'(options?: TransactionOptions): Promise<GoldMine>;
    }

    export interface ProjectArtifacts extends TruffleArtifacts {
        require(name: string): AnyContract;

        require(name: './Migrations.sol'): MigrationsContract;

        require(name: './ResourceToken.sol'): ResourceContract;

        require(name: './GoldMine.sol'): GoldMineContract;
    }
}

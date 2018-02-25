declare module 'project' {
    import {BigNumber} from 'bignumber.js';
    import {
        AnyContract,
        Contract,
        ContractBase,
        TransactionOptions,
        TransactionResult,
        TruffleArtifacts
    } from 'truffle';
    import {AnyNumber} from 'web3';

    namespace project {
        interface Migrations extends ContractBase {
            setCompleted(completed: number,
                         options?: TransactionOptions): Promise<TransactionResult>;

            upgrade(address: Address,
                    options?: TransactionOptions): Promise<TransactionResult>;
        }

        interface ERC20 extends ContractBase {
            totalSupply(): Promise<BigNumber>;

            balanceOf(who: Address): Promise<BigNumber>;

            transfer(to: Address,
                     amount: BigNumber,
                     options?: TransactionOptions): Promise<TransactionResult>;

            allowance(owner: Address, spender: Address): Promise<BigNumber>;

            transferFrom(from: Address,
                         to: Address,
                         value: AnyNumber,
                         options?: TransactionOptions): Promise<TransactionResult>;

            approve(spender: Address,
                    value: AnyNumber,
                    options?: TransactionOptions): Promise<TransactionResult>;
        }

        interface TransferEvent {
            from: Address;
            to: Address;
            value: BigNumber;
        }

        interface ApprovalEvent {
            owner: Address;
            spender: Address;
            value: BigNumber;
        }

        interface Mintable {
            isMintingManager(addr: Address,
                             options?: TransactionOptions): Promise<boolean>;

            addMintingManager(addr: Address,
                              options?: TransactionOptions): Promise<TransactionResult>;

            mint(to: Address,
                 amount: AnyNumber,
                 options?: TransactionOptions): Promise<TransactionResult>;

            finishMinting(options?: TransactionOptions): Promise<TransactionResult>;
        }

        interface MintedEvent {
            to: Address;
            amount: BigNumber;
        }

        interface MintingManagerApprovedEvent {
            addr: Address;
        }

        interface Resource extends ERC20, Mintable {
        }

        interface ResourceCost {
            resource: Address;
            amount: BigNumber;
        }

        interface MineInstance {
            buildTime: BigNumber;
            lastMiningTime: BigNumber;
            mined: BigNumber;
        }

        interface Mine extends ContractBase {
            setCost(resources: Address[],
                    amounts: AnyNumber[],
                    options?: TransactionOptions): Promise<void>;

            buildInstance(options?: TransactionOptions): Promise<TransactionResult>;

            getCosts(): Promise<BigNumber>;

            getCost(index: AnyNumber): Promise<any[]>;

            getInstances(options?: TransactionOptions): Promise<BigNumber>;

            getInstance(index: AnyNumber, options?: TransactionOptions): Promise<any[]>;
        }

        interface MigrationsContract extends Contract<Migrations> {
            'new'(options?: TransactionOptions): Promise<Migrations>;
        }

        interface ResourceContract extends Contract<Resource> {
            'new'(name: string,
                  symbol: string,
                  decimals: AnyNumber,
                  options?: TransactionOptions): Promise<Resource>;
        }

        interface MineContract extends Contract<Mine> {
            'new'(options?: TransactionOptions): Promise<Mine>;
        }

        interface ProjectArtifacts extends TruffleArtifacts {
            require(name: string): AnyContract;

            require(name: './Migrations.sol'): MigrationsContract;

            require(name: './ResourceToken.sol'): ResourceContract;

            require(name: './Mine.sol'): MineContract;
        }
    }

    export = project;
}

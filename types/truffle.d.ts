declare module '*.json' {
    const value: any;
    export default value;
}

declare module 'truffle' {
    import {Address, AnyNumber} from 'common';
    import {TxData} from 'web3';

    export type ScriptFinalizer = ((err?: any) => void);

    export type ContractCallback = (this: Mocha.ISuiteCallbackContext, accounts: Address[]) => void;

    export type ContractContextDefinition = (description: string, callback: ContractCallback) => Mocha.ISuite;

    export interface Request {
        method: 'eth_call' | 'eth_sendTransaction';
        params: RequestParameter[];
    }

    export interface RequestParameter {
        to: Address;
        data: string;
    }

    export interface Method {
        call(...args: any[]): Promise<any>;

        sendTransaction(...args: any[]): Promise<string>;

        request(...args: any[]): Promise<Request>;

        estimateGas(...args: any[]): Promise<number>;
    }

    export interface ContractBase {
        address: Address;

        sendTransaction(txData: Partial<TxData>): Promise<TransactionResult>;
    }

    export interface Contract<T> extends ContractBase {
        at(address: Address): Promise<T>;

        deployed(): Promise<T>;
    }

    export interface AnyContract extends Contract<any> {
        'new'(...args: any[]): Promise<any>;
    }

    export interface TruffleArtifacts {
        require(name: string): AnyContract;
    }

    export type TransactionOptions = {
        from?: Address;
        gas?: number;
        gasPrice?: number;
        value?: AnyNumber;
    };

    export type TransactionReceipt = {
        transactionHash: string;
        transactionIndex: number;
        blockHash: string;
        blockNumber: number;
        gasUsed: number;
        cumulativeGasUsed: number;
        contractAddress: Address | null;
        logs: [TransactionLog];
    };

    export type TransactionLog = {
        logIndex: number;
        transactionIndex: number;
        transactionHash: string;
        blockHash: string;
        blockNumber: number;
        address: Address;
        type: string;
        event: string;
        args: any;
    };

    export type TransactionResult = {
        tx: string;
        receipt: TransactionReceipt;
        logs: [TransactionLog];
    };

    export interface Deployer extends Promise<void> {
        deploy(object: ContractBase, ...args: any[]): Promise<void>;

        link(library: ContractBase, contracts: ContractBase | [ContractBase]): Promise<void>;
    }
}

declare module 'truffle-config' {
    import {BigNumber} from 'bignumber.js';
    import {Provider} from 'web3';

    import {Address} from 'common';
    import {Artifactor} from 'truffle-artifactor';
    import {Resolver} from 'truffle-resolver';

    type Options = {
        contracts_build_directory?: string;
        contracts_directory?: string;
        debug?: boolean;
        deterministic?: boolean;
        gasLimit?: number;
        gasPrice?: number | string | BigNumber;
        hostname?: string;
        logger?: { log: (...args: any[]) => void };
        mem?: boolean;
        migrations_directory?: string;
        mnemonic?: string;
        network?: string;
        networkId?: number;
        port?: number;
        reset?: boolean;
        secure?: boolean;
        seed?: string;
        working_directory?: string;
    };

    class Config {
        public artifactor: Artifactor;
        public contracts_build_directory: string;
        public contracts_directory: string;
        public migrations_directory: string;
        public network: string;
        public networks: { [network: string]: Network };
        public port: number;
        public provider: Provider;
        public resolver: Resolver;
    }

    type Network = {
        network_id: string;
        from: Address;
    };

    export function detect(config: Options, filename?: string): Config;

}

declare module 'truffle-compile' {
    import {Callback} from 'common';
    import {Config} from 'truffle-config';

    export type ContractDefinition = {
        contract_name: string;
        sourcePath: string;
        source: string;
        bytecode: string;
        deployedBytecode: string;
    };

    export type ContractDefinitions = { [name: string]: ContractDefinition };

    export function all(config: Config, callback: Callback<ContractDefinitions>): void;

}

declare module 'truffle-resolver' {

    import {Config} from 'truffle-config';

    export class Resolver {
        constructor(config: Config);
    }

}

declare module 'truffle-artifactor' {
    import {ContractDefinitions} from 'truffle-compile';

    export class Artifactor {
        constructor(contractsBuildDirectory: string);

        public saveAll(contracts: ContractDefinitions): Promise<void>;
    }

}

declare module 'truffle-migrate' {
    import {Callback} from 'common';
    import {Config} from 'truffle-config';

    function run(config: Config, cb: Callback<any>): Config;
}

declare module 'project' {
  import { BigNumber } from 'bignumber.js';
  import {
    AnyContract,
    Contract,
    ContractBase,
    TransactionOptions,
    TransactionResult,
    TruffleArtifacts
  } from 'truffle';
    import { AnyNumber } from 'web3';

  namespace project {
    interface Migrations extends ContractBase {
      setCompleted(
        completed: number,
        options?: TransactionOptions
      ): Promise<TransactionResult>;

      upgrade(
        address: Address,
        options?: TransactionOptions
      ): Promise<TransactionResult>;
    }
    
    interface Exchange extends ContractBase {
      exampleAttribute(): Promise<BigNumber>;

      exampleFunction(
        newValue: AnyNumber,
        options?: TransactionOptions
      ): Promise<TransactionResult>;
    }
    
    
    interface ExampleAttributeChangedEvent {
      newValue: BigNumber;
    }

    interface MigrationsContract extends Contract<Migrations> {
      'new'(options?: TransactionOptions): Promise<Migrations>;
    }
    
    interface ExchangeContract extends Contract<Exchange> {
      'new'(options?: TransactionOptions): Promise<Exchange>;
    }
    
    interface ProjectArtifacts extends TruffleArtifacts {
      require(name: string): AnyContract;
      require(name: './Migrations.sol'): MigrationsContract;
      require(name: './Exchange.sol'): ExchangeContract;
    }
  }

  export = project;
}

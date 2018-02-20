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

    interface ERC20 extends ContractBase {
      totalSupply(): Promise<BigNumber>;
      balanceOf(who: Address): Promise<BigNumber>;

      transfer(
          to: Address,
          amount: BigNumber,
          options?: TransactionOptions
      ): Promise<TransactionResult>;

      allowance(owner: Address, spender: Address): Promise<BigNumber>;

      transferFrom(
          from: Address,
          to: Address,
          value: AnyNumber,
          options?: TransactionOptions
      ): Promise<TransactionResult>;

      approve(
          spender: Address,
          value: AnyNumber,
          options?: TransactionOptions
      ): Promise<TransactionResult>;
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

    interface Resource extends ERC20 {}

    interface MigrationsContract extends Contract<Migrations> {
      'new'(options?: TransactionOptions): Promise<Migrations>;
    }

    interface ResourceContract extends Contract<Resource> {
      'new'(options?: TransactionOptions): Promise<Resource>;
    }

    interface ProjectArtifacts extends TruffleArtifacts {
      require(name: string): AnyContract;
      require(name: './Migrations.sol'): MigrationsContract;
      require(name: './ResourceToken.sol'): ResourceContract;
    }
  }

  export = project;
}

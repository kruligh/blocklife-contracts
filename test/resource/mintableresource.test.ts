import { assert } from 'chai';

import * as Web3 from 'web3';

import {
  MintedEvent,
  MintingManagerApprovedEvent,
  TransferEvent
} from 'project';
import {
  assertNumberEqual,
  assertReverts,
  findLastLog,
  ZERO_ADDRESS
} from '../helpers/common.helper';
import { ResourceTestContext } from './context';

declare const web3: Web3;

export function testAddMintingManager(ctx: ResourceTestContext) {
  let mintingManager: Address;
  let otherAccount: Address;

  beforeEach(() => {
    mintingManager = ctx.accounts[0];
    otherAccount = ctx.accounts[1];
  });

  it('should approve minting manager', async () => {
    assert.isFalse(await ctx.token.isMintingManager(mintingManager));

    await ctx.token.addMintingManager(mintingManager, { from: ctx.owner });

    assert.isTrue(await ctx.token.isMintingManager(mintingManager));
  });

  it('should approve multiple minting managers', async () => {
    const managers = ctx.accounts.slice(0, 4);
    await Promise.all(
      managers.map(account =>
        ctx.token.addMintingManager(account, { from: ctx.owner })
      )
    );

    for (const account of managers) {
      assert.isTrue(await ctx.token.isMintingManager(account));
    }
  });

  it('should emit MintingManagerApproved event', async () => {
    const tx = await ctx.token.addMintingManager(mintingManager, {
      from: ctx.owner
    });

    const log = findLastLog(tx, 'MintingManagerAdded');
    assert.isOk(log);

    const event = log.args as MintingManagerApprovedEvent;
    assert.isOk(event);
    assert.equal(event.addr, mintingManager);
  });

  it('should revert when called by non-owner', async () => {
    await assertReverts(async () => {
      await ctx.token.addMintingManager(mintingManager, {
        from: otherAccount
      });
    });
  });
}

export function testMint(ctx: ResourceTestContext) {
  let mintingManager: Address;
  let otherAccount: Address;
  let destinationAccount: Address;

  beforeEach(async () => {
    mintingManager = ctx.accounts[0];
    otherAccount = ctx.accounts[1];
    destinationAccount = ctx.accounts[2];
    await ctx.token.addMintingManager(mintingManager, { from: ctx.owner });
  });

  it('should increase total supply', async () => {
    const amount = 1;
    const expectedSupply = (await ctx.token.totalSupply()).add(amount);

    await ctx.token.mint(destinationAccount, amount, { from: mintingManager });

    assertNumberEqual(await ctx.token.totalSupply(), expectedSupply);
  });

  it('should increase balance of destination account', async () => {
    const amount = 1;
    const expectedValue = (await ctx.token.balanceOf(destinationAccount)).add(
      amount
    );

    await ctx.token.mint(destinationAccount, amount, { from: mintingManager });

    assertNumberEqual(
      await ctx.token.balanceOf(destinationAccount),
      expectedValue
    );
  });

  it('should emit Minted event', async () => {
    const amount = 1;
    const tx = await ctx.token.mint(destinationAccount, amount, {
      from: mintingManager
    });

    const log = findLastLog(tx, 'Minted');
    assert.isOk(log);

    const event = log.args as MintedEvent;
    assert.isOk(event);
    assert.equal(event.to, destinationAccount);
    assertNumberEqual(event.amount, amount);
  });

  it('should emit Transfer event', async () => {
    const amount = 1;
    const tx = await ctx.token.mint(destinationAccount, amount, {
      from: mintingManager
    });

    const log = findLastLog(tx, 'Transfer');
    assert.isOk(log);

    const event = log.args as TransferEvent;
    assert.isOk(event);
    assert.equal(event.from, ZERO_ADDRESS);
    assert.equal(event.to, destinationAccount);
    assertNumberEqual(event.value, amount);
  });

  it('should revert when called by not minting manager', async () => {
    await assertReverts(async () => {
      await ctx.token.mint(destinationAccount, 1, {
        from: otherAccount
      });
    });
  });
}

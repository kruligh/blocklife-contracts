import { assert } from 'chai';

import { Resource } from 'blocklife-contracts';
import { ContractContextDefinition } from 'truffle';
import { ResourceHelper } from './helpers/resource.helper';
import { ResourceTestContext } from './resource/context';
import { testAddMintingManager, testMint } from './resource/mintableresource.test';
import {Address} from 'common';

declare const contract: ContractContextDefinition;

contract('ResourceToken', (accounts: Address[]) => {
    const owner = accounts[9];
    let resource: Resource;
    let resourceHelper: ResourceHelper;

    beforeEach(async () => {
        resourceHelper = new ResourceHelper(owner);
    });

    describe('#ctor', () => {
        it('should create contract', async () => {
            resource = await resourceHelper.createContract();
            assert.isOk(resource);
        });
    });

    context('Given deployed token contract', () => {
        const ctx: ResourceTestContext = new ResourceTestContext(accounts.filter(acc => acc !== owner), owner);

        beforeEach(async () => {
            ctx.token = await resourceHelper.createContract();
        });

        describe('MintableResource', () => {
            describe('#mint', () => testMint(ctx));
            describe('#addMintingManager', () => testAddMintingManager(ctx));
        });
    });
});

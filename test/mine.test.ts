import {assert} from 'chai';

import BigNumber from 'bignumber.js';
import {Mine, MineContract, ProjectArtifacts, Resource} from 'project';
import {ContractContextDefinition} from 'truffle';
import {assertNumberEqual, assertReverts, ZERO_ADDRESS} from './helpers/common.helper';
import {MineHelper} from './helpers/mine.helper';
import {ResourceHelper} from './helpers/resource.helper';

declare const contract: ContractContextDefinition;

contract('Mine', (accounts: Address[]) => {
    const owner = accounts[9];
    const notOwner = accounts[8];
    let resource: Resource;
    let resourceHelper: ResourceHelper;
    let mine: Mine;
    let mineHelper: MineHelper;

    describe('#ctor', () => {
        it('should create contract', async () => {
            mineHelper = new MineHelper(owner);
            mine = await mineHelper.createContract();

            assert.isOk(mine);
        });
    });

    describe('#setCost', () => {
        beforeEach(async () => {
            resourceHelper = new ResourceHelper(owner);
            resource = await resourceHelper.createContract();
            assert.isOk(resource);
            mine = await mineHelper.createContract();
            assert.isOk(mine);
        });

        it('should set cost', async () => {
            await resource.addMintingManager(mine.address, {from: owner});
            assert.isTrue(await resource.isMintingManager(mine.address));
            const amount = new BigNumber(500);
            await mine.setCost([resource.address], [amount], {from: owner});
            const resourceCost = MineHelper.parseResourceCost(await mine.getCost(0));
            assertNumberEqual(resourceCost.amount, amount);
            assert.equal(resourceCost.resource, resource.address);
        });

        it('should set multiple resources cost', async () => {
            const amountResourceA = new BigNumber(500);
            const resourceA = resource;
            await resourceA.addMintingManager(mine.address, {from: owner});
            assert.isTrue(await resourceA.isMintingManager(mine.address));

            const amountResourceB = new BigNumber(3);
            const resourceB = await resourceHelper.createContract();
            await resourceB.addMintingManager(mine.address, {from: owner});
            assert.isTrue(await resourceB.isMintingManager(mine.address));

            await mine.setCost([resourceA.address, resourceB.address], [amountResourceA, amountResourceB], {
                from: owner
            });

            const resourceACost = MineHelper.parseResourceCost(await mine.getCost(0));
            assertNumberEqual(resourceACost.amount, amountResourceA);
            assert.equal(resourceACost.resource, resourceA.address);

            const resourceBCost = MineHelper.parseResourceCost(await mine.getCost(1));
            assertNumberEqual(resourceBCost.amount, amountResourceB);
            assert.equal(resourceBCost.resource, resourceB.address);
        });

        it('should revert if not owner', async () => {
            await assertReverts(async () => {
                await mine.setCost([resource.address], [new BigNumber(500)], {
                    from: notOwner
                });
            });
        });

        it('should revert if price already set', async () => {
            await resource.addMintingManager(mine.address, {from: owner});
            assert.isTrue(await resource.isMintingManager(mine.address));
            await mine.setCost([resource.address], [new BigNumber(500)], {
                from: owner
            });
            await assertReverts(async () => {
                await mine.setCost([resource.address], [new BigNumber(500)], {
                    from: owner
                });
            });
        });

        it('should revert if amounts.length>resources.length', async () => {
            await resource.addMintingManager(mine.address, {from: owner});
            assert.isTrue(await resource.isMintingManager(mine.address));
            await assertReverts(async () => {
                await mine.setCost([resource.address], [new BigNumber(500), new BigNumber(600)], {from: owner});
            });
        });

        it('should revert if resources.length>amounts.length', async () => {
            await resource.addMintingManager(mine.address, {from: owner});
            assert.isTrue(await resource.isMintingManager(mine.address));
            const resource2 = await resourceHelper.createContract();
            await resource2.addMintingManager(mine.address, {from: owner});
            assert.isTrue(await resource2.isMintingManager(mine.address));

            await assertReverts(async () => {
                await mine.setCost([resource.address, resource2.address], [new BigNumber(500)], {from: owner});
            });
        });

        it('should revert if resource address is zero', async () => {
            await assertReverts(async () => {
                await mine.setCost([ZERO_ADDRESS], [new BigNumber(500)], {
                    from: owner
                });
            });
        });

        it('should revert if amount is zero', async () => {
            await resource.addMintingManager(mine.address, {from: owner});
            assert.isTrue(await resource.isMintingManager(mine.address));
            await assertReverts(async () => {
                await mine.setCost([resource.address], [new BigNumber(0)], {
                    from: owner
                });
            });
        });

        it('should revert if is not minting manager', async () => {
            assert.isFalse(await resource.isMintingManager(mine.address));
            await assertReverts(async () => {
                await mine.setCost([resource.address], [new BigNumber(500)], {
                    from: owner
                });
            });
        });
    });

    describe('#getCost', async () => {

        beforeEach(async () => {
            mineHelper = new MineHelper(owner);
            mine = await mineHelper.createContract();
        });

        it('Should revert if index array out of bounds', async () => {
            await assertReverts(async () => {
                await mine.getCost(3);
            });
        });
    });

    describe('#getInstance', async () => {
        const buyer = notOwner;

        beforeEach(async () => {
            mineHelper = new MineHelper(owner);
            mine = await mineHelper.createContract();
        });

        it('Should revert if index array out of bounds', async () => {
            await assertReverts(async () => {
                await mine.getInstance(3, {from: buyer});
            });
        });
    });

    describe('#build', () => {
        const buyer = notOwner;

        beforeEach(async () => {
            resourceHelper = new ResourceHelper(owner);
            resource = await resourceHelper.createContract();
            assert.isOk(resource);
            mineHelper = new MineHelper(owner);
            mine = await mineHelper.createContract();
            assert.isOk(mine);
        });

        it('Should build', async () => {
            await mine.buildInstance({from: buyer});
            assertNumberEqual(await mine.getInstances({from: buyer}), new BigNumber(1));
            const mineInstance = MineHelper.parseMineInstance(await mine.getInstance(0, {from: buyer}));
            assertNumberEqual(mineInstance.buildTime, mineInstance.lastMiningTime);
            assertNumberEqual(mineInstance.mined, new BigNumber(0));
        });
    });
});

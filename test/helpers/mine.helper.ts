import {Mine, ProjectArtifacts, ResourceCost} from 'project';
import {propOr} from 'ramda';

declare const artifacts: ProjectArtifacts;

const MineContract = artifacts.require('./Mine.sol');

export class MineHelper {
    public constructor(private owner: Address) {
    }

    public async createContract(options?: Partial<MineContractOptions>): Promise<Mine> {
        return await MineContract.new({
            from: propOr(this.owner, 'from', options)
        });
    }

    public parseResourceCost(args: any[]): ResourceCost {
        return {
            amount: args[1],
            resource: args[0]
        } as ResourceCost;
    }
}

export interface MineContractOptions {
    from: Address;
}

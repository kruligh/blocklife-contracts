import { Mine, MineInstance, ProjectArtifacts, ResourceCost } from 'project';
import { propOr } from 'ramda';

declare const artifacts: ProjectArtifacts;

const MineContract = artifacts.require('./Mine.sol');

export class MineHelper {
    public static parseResourceCost(args: any[]): ResourceCost {
        return {
            amount: args[1],
            resource: args[0]
        } as ResourceCost;
    }

    public static parseMineInstance(args: any[]): MineInstance {
        return {
            buildTime: args[0],
            lastMiningTime: args[1],
            mined: args[2]
        };
    }

    public constructor(private owner: Address) {}

    public async createContract(options?: Partial<MineContractOptions>): Promise<Mine> {
        return await MineContract.new({
            from: propOr(this.owner, 'from', options)
        });
    }
}

export interface MineContractOptions {
    from: Address;
}

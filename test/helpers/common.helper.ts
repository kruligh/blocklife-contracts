import * as Web3 from 'web3';

import {BigNumber} from 'bignumber.js';
import {assert} from 'chai';
import {findLast, propEq} from 'ramda';
import {TransactionLog, TransactionResult} from 'truffle';

import {AnyNumber} from 'common';
import {ETH_DECIMALS, Web3Utils} from '../../utils/index';

declare const web3: Web3;

const utils = new Web3Utils(web3);

export const ZERO_ADDRESS = '0x' + '0'.repeat(40);

export async function assertReverts(func: () => void) {
    try {
        await func();
    } catch (error) {
        assertRevertError(error);
        return;
    }
    assert.fail({}, {}, 'Should have reverted');
}

export function assertRevertError(error: { message: string }) {
    if (error && error.message) {
        if (error.message.search('revert') === -1) {
            assert.fail(error, {}, 'Expected revert error, instead got: ' + error.message);
        }
    } else {
        assert.fail(error, {}, 'Expected revert error');
    }
}

export function assertNumberEqual(actual: AnyNumber, expect: AnyNumber, decimals: number = 0) {
    const actualNum = new BigNumber(actual);
    const expectNum = new BigNumber(expect);

    if (!actualNum.eq(expectNum)) {
        const div = decimals ? Math.pow(10, decimals) : 1;
        assert.fail(
            actualNum.toFixed(),
            expectNum.toFixed(),
            `${actualNum.div(div).toFixed()} == ${expectNum.div(div).toFixed()}`,
            '=='
        );
    }
}

export function assertNumberAlmostEqual(actual: AnyNumber,
                                        expect: AnyNumber,
                                        epsilon: AnyNumber,
                                        decimals: number = 0) {
    const actualNum = new BigNumber(actual);
    const expectNum = new BigNumber(expect);
    const epsilonNum = new BigNumber(epsilon);

    if (actualNum.lessThan(expectNum.sub(epsilonNum)) || actualNum.greaterThan(expectNum.add(epsilonNum))) {
        const div = decimals ? Math.pow(10, decimals) : 1;
        assert.fail(
            actualNum.toFixed(),
            expectNum.toFixed(),
            `${actualNum.div(div).toFixed()} == ${expectNum.div(div).toFixed()} (precision ${epsilonNum
                .div(div)
                .toFixed()})`,
            '=='
        );
    }
}

export function assertEtherEqual(actual: AnyNumber, expect: AnyNumber) {
    return assertNumberEqual(actual, expect, ETH_DECIMALS);
}

export function findLastLog(trans: TransactionResult, event: string): TransactionLog {
    return findLast(propEq('event', event))(trans.logs);
}

export async function getNetworkTimestamp(): Promise<BigNumber> {
    return (await utils.getBlock()).timestamp;
}

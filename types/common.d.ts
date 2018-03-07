declare module 'common' {

    import {BigNumber} from 'bignumber.js';

    export type Callback<T> = (err: Error | null, value: T) => void;

    export type Address = string;

    export type AnyNumber = number | string | BigNumber;

}

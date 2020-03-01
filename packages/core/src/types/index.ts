import {interfaces} from 'inversify';
import {Vue as V} from 'vue/types/vue';

export import Newable = interfaces.Newable;
export import Context = interfaces.Context;
export import Container = interfaces.Container;
export import ServiceIdentifier = interfaces.ServiceIdentifier;

export interface Vue extends V {
}

export type ProvidedIn = 'root' | 'self';

// Still don't know how to fix generating types/index.d.ts in dist/ directory
export const justForOutputDTSFile = () => {
    return false;
};

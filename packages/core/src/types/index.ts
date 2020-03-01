import {interfaces} from 'inversify';

export import Newable = interfaces.Newable;
export import Context = interfaces.Context;
export import Container = interfaces.Container;
export import ServiceIdentifier = interfaces.ServiceIdentifier;
export {Vue} from 'vue/types/vue';

export type ProvidedIn = 'root' | 'self';

// Still don't know how to fix generating types/index.d.ts in dist/ directory
export const justForOutputDTSFile = () => {
    return false;
};

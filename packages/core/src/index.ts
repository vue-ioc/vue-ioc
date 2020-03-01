export {Injectable} from './decorators/Injectable';
export {Inject, InjectReactive} from './decorators/Inject';
export {Module} from './decorators/Module';
export {PostConstruct} from './decorators/PostConstruct';
export {BeforeDestroy} from './decorators/BeforeDestroy';
export {VueIocPlugin} from './plugin/VueIocPlugin';
export {createInstanceHandlerDecorator} from './instance-listener/createInstanceHandlerDecorator';
export {Injector} from './injector/Injector';

import {justForOutputDTSFile} from './types';
justForOutputDTSFile();

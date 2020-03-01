import {Container, ServiceIdentifier} from '../types';

export class Injector {
    constructor(private container: Container) {
    }

    public get<T>(identifier: ServiceIdentifier<T>): T {
        return this.container.get(identifier);
    }
}

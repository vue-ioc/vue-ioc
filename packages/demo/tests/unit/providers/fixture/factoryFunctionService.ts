import {FooService} from './FooService';

export function factoryFunctionService(fooService: FooService) {
  return {
      fooService
  }
}
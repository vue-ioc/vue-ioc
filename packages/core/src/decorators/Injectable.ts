import {injectable} from 'inversify';
import 'reflect-metadata';

export function Injectable() {
  if (arguments.length !== 0) {
    throw new Error('Please use @Injectable() with parentheses');
  }
  return injectable();
}

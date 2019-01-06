export function isVuePrototype(target: any) {
    return target.$nextTick && target.$watch; // todo - better way to detect Vue prototype
}

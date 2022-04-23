"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constant = exports.isFunction = void 0;
function isFunction(func) {
    return typeof func === 'function';
}
exports.isFunction = isFunction;
function constant(val) {
    return () => val;
}
exports.constant = constant;
//# sourceMappingURL=dash.js.map
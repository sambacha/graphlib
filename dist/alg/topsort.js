"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CycleException = exports.topsort = void 0;
const lodash_has_1 = __importDefault(require("lodash.has"));
/**
 * Given a Graph graph this function applies topological sorting to it.
 * If the graph has a cycle it is impossible to generate such a list and CycleException is thrown.
 * Complexity: O(|V| + |E|).
 *
 * @argument graph - graph to apply topological sorting to.
 * @returns an array of nodes such that for each edge u -> v, u appears before v in the array.
 */
function topsort(g) {
    var _a;
    const visited = {};
    const stack = {};
    const results = [];
    function visit(node) {
        var _a;
        if ((0, lodash_has_1.default)(stack, node)) {
            throw new CycleException();
        }
        if (!(0, lodash_has_1.default)(visited, node)) {
            stack[node] = true;
            visited[node] = true;
            (_a = g.predecessors(node)) === null || _a === void 0 ? void 0 : _a.forEach(visit);
            delete stack[node];
            results.push(node);
        }
    }
    (_a = g.sinks()) === null || _a === void 0 ? void 0 : _a.forEach(visit);
    if (Object.keys(visited).length !== g.nodeCount()) {
        throw new CycleException();
    }
    return results;
}
exports.topsort = topsort;
class CycleException extends Error {
}
exports.CycleException = CycleException;
//# sourceMappingURL=topsort.js.map
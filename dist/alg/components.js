"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.components = void 0;
const lodash_has_1 = __importDefault(require("lodash.has"));
/**
 * Finds all connected components in a graph and returns an array of these components.
 * Each component is itself an array that contains the ids of nodes in the component.
 * Complexity: O(|V|).
 *
 * @argument graph - graph to find components in.
 * @returns array of nodes list representing components
 */
function components(g) {
    const visited = {};
    const cmpts = [];
    let cmpt;
    function dfs(v) {
        var _a, _b;
        if ((0, lodash_has_1.default)(visited, v))
            return;
        visited[v] = true;
        cmpt.push(v);
        ((_a = g.successors(v)) !== null && _a !== void 0 ? _a : []).forEach(dfs);
        ((_b = g.predecessors(v)) !== null && _b !== void 0 ? _b : []).forEach(dfs);
    }
    for (const v of g.nodes()) {
        cmpt = [];
        dfs(v);
        if (cmpt.length) {
            cmpts.push(cmpt);
        }
    }
    return cmpts;
}
exports.components = components;
//# sourceMappingURL=components.js.map
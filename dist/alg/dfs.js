"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dfs = void 0;
const lodash_has_1 = __importDefault(require("lodash.has"));
/**
 * A helper that preforms a pre- or post-order traversal on the input graph
 * and returns the nodes in the order they were visited. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * Order must be one of "pre" or "post".
 */
function dfs(g, vs, order) {
    const navigation = (g.isDirected() ? g.successors : g.neighbors).bind(g);
    const acc = [];
    const visited = {};
    for (const v of vs) {
        if (!g.hasNode(v)) {
            throw new Error('Graph does not have node: ' + v);
        }
        doDfs(g, v, order === 'post', visited, navigation, acc);
    }
    return acc;
}
exports.dfs = dfs;
function doDfs(g, v, postorder, visited, navigation, acc) {
    if (!(0, lodash_has_1.default)(visited, v)) {
        visited[v] = true;
        if (!postorder) {
            acc.push(v);
        }
        for (const w of navigation(v)) {
            doDfs(g, w, postorder, visited, navigation, acc);
        }
        if (postorder) {
            acc.push(v);
        }
    }
}
//# sourceMappingURL=dfs.js.map
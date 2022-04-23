"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postorder = void 0;
const dfs_1 = require("./dfs");
/**
 * Performs post-order depth first traversal on the input graph. If the graph is
 * undirected then this algorithm will navigate using neighbors. If the graph
 * is directed then this algorithm will navigate using successors.
 *
 * @argument graph - depth first traversal target.
 * @argument vs - nodes list to traverse.
 * @returns the nodes in the order they were visited as a list of their names.
 */
function postorder(g, vs) {
    return (0, dfs_1.dfs)(g, vs, 'post');
}
exports.postorder = postorder;
//# sourceMappingURL=postorder.js.map
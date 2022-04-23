"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dijkstraAll = void 0;
const lodash_transform_1 = __importDefault(require("lodash.transform"));
const dijkstra_1 = require("./dijkstra");
/**
 * This function finds the shortest path from each node to every other reachable node in
 * the graph. It is similar to alg.dijkstra, but instead of returning a single-source
 * array, it returns a mapping of source -> alg.dijksta(g, source, weightFn, edgeFn).
 * Complexity: O(|V| * (|E| + |V|) * log |V|).
 *
 * @argument graph - graph where to search pathes.
 * @argument weightFn - function which takes edge e and returns the weight of it. If no weightFn
 * is supplied then each edge is assumed to have a weight of 1. This function throws an
 * Error if any of the traversed edges have a negative edge weight.
 * @argument edgeFn - function which takes a node v and returns the ids of all edges incident to it
 * for the purposes of shortest path traversal. By default this function uses the graph.outEdges.
 * @returns shortest pathes map.
 */
function dijkstraAll(g, weightFunc, edgeFunc) {
    return (0, lodash_transform_1.default)(g.nodes(), function (acc, v) {
        acc[v] = (0, dijkstra_1.dijkstra)(g, v, weightFunc, edgeFunc);
    }, {});
}
exports.dijkstraAll = dijkstraAll;
//# sourceMappingURL=dijkstra-all.js.map
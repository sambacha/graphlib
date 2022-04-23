"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCycles = void 0;
const lodash_filter_1 = __importDefault(require("lodash.filter"));
const tarjan_1 = require("./tarjan");
/**
 * Given a Graph, graph, this function returns all nodes that are part of a cycle. As there
 * may be more than one cycle in a graph this function return an array of these cycles,
 * where each cycle is itself represented by an array of ids for each node involved in
 * that cycle. Method alg.isAcyclic is more efficient if you only need to determine whether a graph has a
 * cycle or not.
 * Complexity: O(|V| + |E|).
 *
 * @argument graph - graph where to search cycles.
 * @returns cycles list.
 */
function findCycles(g) {
    return (0, lodash_filter_1.default)((0, tarjan_1.tarjan)(g), function (cmpt) {
        return (cmpt.length > 1 || (cmpt.length === 1 && g.hasEdge(cmpt[0], cmpt[0])));
    });
}
exports.findCycles = findCycles;
//# sourceMappingURL=find-cycles.js.map
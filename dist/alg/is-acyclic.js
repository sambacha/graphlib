"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAcyclic = void 0;
const topsort_1 = require("./topsort");
/**
 * Given a Graph, graph, this function returns true if the graph has no cycles and returns false if it
 * does. This algorithm returns as soon as it detects the first cycle. You can use alg.findCycles
 * to get the actual list of cycles in the graph.
 *
 * @argument graph - graph to detect whether it acyclic ot not.
 * @returns whether graph contain cycles or not.
 */
function isAcyclic(g) {
    try {
        (0, topsort_1.topsort)(g);
    }
    catch (e) {
        if (e instanceof topsort_1.CycleException) {
            return false;
        }
        throw e;
    }
    return true;
}
exports.isAcyclic = isAcyclic;
//# sourceMappingURL=is-acyclic.js.map
import type { Edge, Graph } from '..';
export interface Path {
    distance: number;
    predecessor: string;
}
/**
 * This function is an implementation of Dijkstra's algorithm which finds the shortest
 * path from source to all other nodes in graph. This function returns a map of
 * v -> { distance, predecessor }. The distance property holds the sum of the weights
 * from source to v along the shortest path or Number.POSITIVE_INFINITY if there is no path
 * from source. The predecessor property can be used to walk the individual elements of the
 * path from source to v in reverse order.
 * Complexity: O((|E| + |V|) * log |V|).
 *
 * @argument graph - graph where to search pathes.
 * @argument source - node to start pathes from.
 * @argument weightFn - function which takes edge e and returns the weight of it. If no weightFn
 * is supplied then each edge is assumed to have a weight of 1. This function throws an
 * Error if any of the traversed edges have a negative edge weight.
 * @argument edgeFn - function which takes a node v and returns the ids of all edges incident to it
 * for the purposes of shortest path traversal. By default this function uses the graph.outEdges.
 * @returns shortest pathes map that starts from node source
 */
export declare function dijkstra(g: Graph, source: string, weightFn?: (e: Edge) => number, edgeFn?: (v: string) => Edge[]): {
    [node: string]: Path;
};

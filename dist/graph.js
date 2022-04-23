"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Graph = void 0;
/* eslint-disable prefer-rest-params */
const lodash_filter_1 = __importDefault(require("lodash.filter"));
const lodash_isempty_1 = __importDefault(require("lodash.isempty"));
const lodash_reduce_1 = __importDefault(require("lodash.reduce"));
const lodash_union_1 = __importDefault(require("lodash.union"));
const dash_1 = require("./dash");
const DEFAULT_EDGE_NAME = '\x00';
const GRAPH_NODE = '\x00';
const EDGE_KEY_DELIM = '\x01';
// Implementation notes:
//
//  * Node id query functions should return string ids for the nodes
//  * Edge id query functions should return an "edgeObj", edge object, that is
//    composed of enough information to uniquely identify an edge: {v, w, name}.
//  * Internally we use an "edgeId", a stringified form of the edgeObj, to
//    reference edges. This is because we need a performant way to look these
//    edges up and, object properties, which have string keys, are the closest
//    we're going to get to a performant hashtable in JavaScript.
class Graph {
    constructor(opts) {
        var _a, _b, _c;
        /* Number of nodes in the graph. Should only be changed by the implementation. */
        this._nodeCount = 0;
        /* Number of edges in the graph. Should only be changed by the implementation. */
        this._edgeCount = 0;
        this._isDirected = (_a = opts === null || opts === void 0 ? void 0 : opts.directed) !== null && _a !== void 0 ? _a : true;
        this._isMultigraph = (_b = opts === null || opts === void 0 ? void 0 : opts.multigraph) !== null && _b !== void 0 ? _b : false;
        this._isCompound = (_c = opts === null || opts === void 0 ? void 0 : opts.compound) !== null && _c !== void 0 ? _c : false;
        // Label for the graph itself
        this._label = undefined;
        // Defaults to be set when creating a new node
        this._defaultNodeLabelFn = () => undefined;
        // Defaults to be set when creating a new edge
        this._defaultEdgeLabelFn = () => undefined;
        // v -> label
        this._nodes = {};
        if (this._isCompound) {
            // v -> parent
            this._parent = {};
            // v -> children
            this._children = {};
            this._children[GRAPH_NODE] = {};
        }
        // v -> edgeObj
        this._in = {};
        // u -> v -> Number
        this._preds = {};
        // v -> edgeObj
        this._out = {};
        // v -> w -> Number
        this._sucs = {};
        // e -> edgeObj
        this._edgeObjs = {};
        // e -> label
        this._edgeLabels = {};
    }
    /* === Graph functions ========= */
    /**
     * Whether graph was created with 'directed' flag set to true or not.
     *
     * @returns whether the graph edges have an orientation.
     */
    isDirected() {
        return this._isDirected;
    }
    /**
     * Whether graph was created with 'multigraph' flag set to true or not.
     *
     * @returns whether the pair of nodes of the graph can have multiple edges.
     */
    isMultigraph() {
        return this._isMultigraph;
    }
    /**
     * Whether graph was created with 'compound' flag set to true or not.
     *
     * @returns whether a node of the graph can have subnodes.
     */
    isCompound() {
        return this._isCompound;
    }
    /**
     * Sets the label of the graph.
     *
     * @argument label - label value.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setGraph(label) {
        this._label = label;
        return this;
    }
    /**
     * Gets the graph label.
     *
     * @returns currently assigned label for the graph or undefined if no label assigned.
     */
    graph() {
        return this._label;
    }
    /* === Node functions ========== */
    /**
     * Sets the default node label factory function. This function will be invoked
     * each time when setting a node with no label specified and returned value
     * will be used as a label for node.
     * Complexity: O(1).
     *
     * @argument labelFn - default node label factory function.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setDefaultNodeLabel(newDefault) {
        if (!(0, dash_1.isFunction)(newDefault)) {
            newDefault = (0, dash_1.constant)(newDefault);
        }
        this._defaultNodeLabelFn = newDefault;
        return this;
    }
    /**
     * Gets the number of nodes in the graph.
     * Complexity: O(1).
     *
     * @returns nodes count.
     */
    nodeCount() {
        return this._nodeCount;
    }
    /**
     * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
     * not included in list.
     * Complexity: O(1).
     *
     * @returns list of graph nodes.
     */
    nodes() {
        return Object.keys(this._nodes);
    }
    /**
     * Gets list of nodes without in-edges.
     * Complexity: O(|V|).
     *
     * @returns the graph source nodes.
     */
    sources() {
        const self = this;
        return (0, lodash_filter_1.default)(this.nodes(), function (v) {
            return (0, lodash_isempty_1.default)(self._in[v]);
        });
    }
    /**
     * Gets list of nodes without out-edges.
     * Complexity: O(|V|).
     *
     * @returns the graph source nodes.
     */
    sinks() {
        const self = this;
        return (0, lodash_filter_1.default)(this.nodes(), function (v) {
            return (0, lodash_isempty_1.default)(self._out[v]);
        });
    }
    /**
     * Invokes setNode method for each node in names list.
     * Complexity: O(|names|).
     *
     * @argument names - list of nodes names to be set.
     * @argument label - value to set for each node in list.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setNodes(vs, value) {
        const args = arguments;
        const self = this;
        for (const v of vs) {
            if (args.length > 1) {
                self.setNode(v, value);
            }
            else {
                self.setNode(v);
            }
        }
        return this;
    }
    /**
     * Creates or updates the value for the node v in the graph. If label is supplied
     * it is set as the value for the node. If label is not supplied and the node was
     * created by this call then the default node label will be assigned.
     * Complexity: O(1).
     *
     * @argument name - node name.
     * @argument label - value to set for node.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setNode(v, value) {
        if (v in this._nodes) {
            if (arguments.length > 1) {
                this._nodes[v] = value;
            }
            return this;
        }
        this._nodes[v] = arguments.length > 1 ? value : this._defaultNodeLabelFn(v);
        if (this._isCompound) {
            this._parent[v] = GRAPH_NODE;
            this._children[v] = {};
            this._children[GRAPH_NODE][v] = true;
        }
        this._in[v] = {};
        this._preds[v] = {};
        this._out[v] = {};
        this._sucs[v] = {};
        ++this._nodeCount;
        return this;
    }
    node(v) {
        return this._nodes[v];
    }
    hasNode(v) {
        return v in this._nodes;
    }
    removeNode(v) {
        var _a;
        const self = this;
        if (v in this._nodes) {
            const removeEdge = function (e) {
                self.removeEdge(self._edgeObjs[e]);
            };
            delete this._nodes[v];
            if (this._isCompound) {
                this._removeFromParentsChildList(v);
                delete this._parent[v];
                for (const child of (_a = this.children(v)) !== null && _a !== void 0 ? _a : []) {
                    self.setParent(child);
                }
                delete this._children[v];
            }
            Object.keys(this._in[v]).forEach(removeEdge);
            delete this._in[v];
            delete this._preds[v];
            Object.keys(this._out[v]).forEach(removeEdge);
            delete this._out[v];
            delete this._sucs[v];
            --this._nodeCount;
        }
        return this;
    }
    /**
     * Sets node p as a parent for node v if it is defined, or removes the
     * parent for v if p is undefined. Method throws an exception in case of
     * invoking it in context of noncompound graph.
     * Average-case complexity: O(1).
     *
     * @argument v - node to be child for p.
     * @argument p - node to be parent for v.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setParent(v, parent) {
        if (!this._isCompound) {
            throw new Error('Cannot set parent in a non-compound graph');
        }
        if (undefined === parent) {
            parent = GRAPH_NODE;
        }
        else {
            // Coerce parent to string
            parent += '';
            for (let ancestor = parent; undefined !== ancestor; ancestor = this.parent(ancestor)) {
                if (ancestor === v) {
                    throw new Error('Setting ' +
                        parent +
                        ' as parent of ' +
                        v +
                        ' would create a cycle');
                }
            }
            this.setNode(parent);
        }
        this.setNode(v);
        this._removeFromParentsChildList(v);
        this._parent[v] = parent;
        this._children[parent][v] = true;
        return this;
    }
    _removeFromParentsChildList(v) {
        delete this._children[this._parent[v]][v];
    }
    /**
     * Gets parent node for node v.
     * Complexity: O(1).
     *
     * @argument v - node to get parent of.
     * @returns parent node name or void if v has no parent.
     */
    parent(v) {
        if (this._isCompound) {
            const parent = this._parent[v];
            if (parent !== GRAPH_NODE) {
                return parent;
            }
        }
        return undefined;
    }
    /**
     * Gets list of direct children of node v.
     * Complexity: O(1).
     *
     * @argument v - node to get children of.
     * @returns children nodes names list.
     */
    children(v) {
        if (undefined === v) {
            v = GRAPH_NODE;
        }
        if (this._isCompound) {
            const children = this._children[v];
            if (children) {
                return Object.keys(children);
            }
        }
        else if (v === GRAPH_NODE) {
            return this.nodes();
        }
        else if (this.hasNode(v)) {
            return [];
        }
        return undefined;
    }
    predecessors(v) {
        const predsV = this._preds[v];
        if (predsV) {
            return Object.keys(predsV);
        }
        return undefined;
    }
    successors(v) {
        const sucsV = this._sucs[v];
        if (sucsV) {
            return Object.keys(sucsV);
        }
        return undefined;
    }
    neighbors(v) {
        const preds = this.predecessors(v);
        if (preds) {
            return (0, lodash_union_1.default)(preds, this.successors(v));
        }
    }
    isLeaf(v) {
        let neighbors;
        if (this.isDirected()) {
            neighbors = this.successors(v);
        }
        else {
            neighbors = this.neighbors(v);
        }
        return neighbors.length === 0;
    }
    /**
     * Creates new graph with nodes filtered via filter. Edges incident to rejected node
     * are also removed. In case of compound graph, if parent is rejected by filter,
     * than all its children are rejected too.
     * Average-case complexity: O(|E|+|V|).
     *
     * @argument filter - filtration function detecting whether the node should stay or not.
     * @returns new graph made from current and nodes filtered.
     */
    filterNodes(filter) {
        const copy = new Graph({
            directed: this._isDirected,
            multigraph: this._isMultigraph,
            compound: this._isCompound,
        });
        copy.setGraph(this.graph());
        const self = this;
        for (const [v, value] of Object.entries(this._nodes)) {
            if (filter(v)) {
                copy.setNode(v, value);
            }
        }
        for (const e of Object.values(this._edgeObjs)) {
            if (copy.hasNode(e.v) && copy.hasNode(e.w)) {
                copy.setEdge(e, self.edge(e));
            }
        }
        const parents = {};
        function findParent(v) {
            const parent = self.parent(v);
            if (parent === undefined || copy.hasNode(parent)) {
                parents[v] = parent;
                return parent;
            }
            else if (parent in parents) {
                return parents[parent];
            }
            else {
                return findParent(parent);
            }
        }
        if (this._isCompound) {
            for (const v of copy.nodes()) {
                copy.setParent(v, findParent(v));
            }
        }
        return copy;
    }
    /* === Edge functions ========== */
    /**
     * Sets the default node label. This label will be assigned as default label
     * in case if no label was specified while setting a node.
     * Complexity: O(1).
     *
     * @argument label - default node label.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setDefaultEdgeLabel(newDefault) {
        if (!(0, dash_1.isFunction)(newDefault)) {
            newDefault = (0, dash_1.constant)(newDefault);
        }
        this._defaultEdgeLabelFn = newDefault;
        return this;
    }
    /**
     * Gets the number of edges in the graph.
     * Complexity: O(1).
     *
     * @returns edges count.
     */
    edgeCount() {
        return this._edgeCount;
    }
    /**
     * Gets edges of the graph. In case of compound graph subgraphs are not considered.
     * Complexity: O(|E|).
     *
     * @return graph edges list.
     */
    edges() {
        return Object.values(this._edgeObjs);
    }
    /**
     * Establish an edges path over the nodes in nodes list. If some edge is already
     * exists, it will update its label, otherwise it will create an edge between pair
     * of nodes with label provided or default label if no label provided.
     * Complexity: O(|nodes|).
     *
     * @argument nodes - list of nodes to be connected in series.
     * @argument label - value to set for each edge between pairs of nodes.
     * @returns the graph, allowing this to be chained with other functions.
     */
    setPath(vs, value) {
        const self = this;
        const args = arguments;
        (0, lodash_reduce_1.default)(vs, function (v, w) {
            if (args.length > 1) {
                self.setEdge(v, w, value);
            }
            else {
                self.setEdge(v, w);
            }
            return w;
        });
        return this;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setEdge(...args) {
        let v, w, name, value;
        let valueSpecified = false;
        const arg0 = arguments[0];
        if (typeof arg0 === 'object' && arg0 !== null && 'v' in arg0) {
            v = arg0.v;
            w = arg0.w;
            name = arg0.name;
            if (arguments.length === 2) {
                value = arguments[1];
                valueSpecified = true;
            }
        }
        else {
            v = arg0;
            w = arguments[1];
            name = arguments[3];
            if (arguments.length > 2) {
                value = arguments[2];
                valueSpecified = true;
            }
        }
        v = '' + v;
        w = '' + w;
        if (undefined !== name) {
            name = '' + name;
        }
        const e = edgeArgsToId(this._isDirected, v, w, name);
        if (e in this._edgeLabels) {
            if (valueSpecified) {
                this._edgeLabels[e] = value;
            }
            return this;
        }
        if (undefined !== name && !this._isMultigraph) {
            throw new Error('Cannot set a named edge when isMultigraph = false');
        }
        // It didn't exist, so we need to create it.
        // First ensure the nodes exist.
        this.setNode(v);
        this.setNode(w);
        this._edgeLabels[e] = valueSpecified
            ? value
            : this._defaultEdgeLabelFn(v, w, name);
        const edgeObj = edgeArgsToObj(this._isDirected, v, w, name);
        // Ensure we add undirected edges in a consistent way.
        v = edgeObj.v;
        w = edgeObj.w;
        Object.freeze(edgeObj);
        this._edgeObjs[e] = edgeObj;
        incrementOrInitEntry(this._preds[w], v);
        incrementOrInitEntry(this._sucs[v], w);
        this._in[w][e] = edgeObj;
        this._out[v][e] = edgeObj;
        this._edgeCount++;
        return this;
    }
    edge(v, w, name) {
        const e = arguments.length === 1
            ? edgeObjToId(this._isDirected, arguments[0])
            : edgeArgsToId(this._isDirected, v, w, name);
        return this._edgeLabels[e];
    }
    hasEdge(v, w, name) {
        const e = arguments.length === 1
            ? edgeObjToId(this._isDirected, arguments[0])
            : edgeArgsToId(this._isDirected, v, w, name);
        return e in this._edgeLabels;
    }
    removeEdge(v, w, name) {
        const e = arguments.length === 1
            ? edgeObjToId(this._isDirected, arguments[0])
            : edgeArgsToId(this._isDirected, v, w, name);
        const edge = this._edgeObjs[e];
        if (edge) {
            v = edge.v;
            w = edge.w;
            delete this._edgeLabels[e];
            delete this._edgeObjs[e];
            decrementOrRemoveEntry(this._preds[w], v);
            decrementOrRemoveEntry(this._sucs[v], w);
            delete this._in[w][e];
            delete this._out[v][e];
            this._edgeCount--;
        }
        return this;
    }
    /**
     * Return all edges that point to the node v. Optionally filters those edges down to just those
     * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     *
     * @argument v - edge sink node.
     * @argument w - edge source node.
     * @returns edges descriptors list if v is in the graph, or undefined otherwise.
     */
    inEdges(v, u) {
        const inV = this._in[v];
        if (inV) {
            const edges = Object.values(inV);
            if (!u) {
                return edges;
            }
            return (0, lodash_filter_1.default)(edges, function (edge) {
                return edge.v === u;
            });
        }
        return undefined;
    }
    /**
     * Return all edges that are pointed at by node v. Optionally filters those edges down to just
     * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     *
     * @argument v - edge source node.
     * @argument w - edge sink node.
     * @returns edges descriptors list if v is in the graph, or undefined otherwise.
     */
    outEdges(v, w) {
        const outV = this._out[v];
        if (outV) {
            const edges = Object.values(outV);
            if (!w) {
                return edges;
            }
            return (0, lodash_filter_1.default)(edges, function (edge) {
                return edge.w === w;
            });
        }
        return undefined;
    }
    /**
     * Returns all edges to or from node v regardless of direction. Optionally filters those edges
     * down to just those between nodes v and w regardless of direction.
     * Complexity: O(|E|).
     *
     * @argument v - edge adjacent node.
     * @argument w - edge adjacent node.
     * @returns edges descriptors list if v is in the graph, or undefined otherwise.
     */
    nodeEdges(v, w) {
        const inEdges = this.inEdges(v, w);
        if (inEdges) {
            return inEdges.concat(this.outEdges(v, w));
        }
        return undefined;
    }
}
exports.Graph = Graph;
function incrementOrInitEntry(map, k) {
    if (map[k]) {
        map[k]++;
    }
    else {
        map[k] = 1;
    }
}
function decrementOrRemoveEntry(map, k) {
    if (!--map[k]) {
        delete map[k];
    }
}
function edgeArgsToId(isDirected, v_, w_, name) {
    let v = '' + v_;
    let w = '' + w_;
    if (!isDirected && v > w) {
        const tmp = v;
        v = w;
        w = tmp;
    }
    return (v +
        EDGE_KEY_DELIM +
        w +
        EDGE_KEY_DELIM +
        (undefined === name ? DEFAULT_EDGE_NAME : name));
}
function edgeArgsToObj(isDirected, v_, w_, name) {
    let v = '' + v_;
    let w = '' + w_;
    if (!isDirected && v > w) {
        const tmp = v;
        v = w;
        w = tmp;
    }
    const edgeObj = { v: v, w: w };
    if (name) {
        edgeObj.name = name;
    }
    return edgeObj;
}
function edgeObjToId(isDirected, edgeObj) {
    return edgeArgsToId(isDirected, edgeObj.v, edgeObj.w, edgeObj.name);
}
//# sourceMappingURL=graph.js.map